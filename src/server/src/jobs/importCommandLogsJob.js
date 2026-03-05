const path = require('path');
const fs = require('fs');

const User = require('../models/User');
const Log = require('../models/Log');

let isRunning = false;

async function importCommandLogsOnce() {
  if (isRunning) {
    return { skipped: true, reason: 'job already running' };
  }

  isRunning = true;

  try {
    const commandLogsDir = path.join(__dirname, '../Trigger-word/command_logs');

    if (!fs.existsSync(commandLogsDir)) {
      console.warn('command_logs directory not found at', commandLogsDir);
      return { imported: 0, usersProcessed: 0 };
    }

    const files = fs.readdirSync(commandLogsDir).filter((f) => f.endsWith('.json'));

    if (files.length === 0) {
      return { imported: 0, usersProcessed: 0 };
    }

    let totalImported = 0;
    let usersProcessed = 0;

    for (const file of files) {
      const email = file.replace(/\.json$/i, '').toLowerCase();
      const filePath = path.join(commandLogsDir, file);

      const user = await User.findOne({ email });
      if (!user) {
        continue;
      }

      usersProcessed += 1;

      let entries;
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        entries = JSON.parse(raw);
        if (!Array.isArray(entries)) {
          continue;
        }
      } catch (err) {
        console.error('Error reading/parsing JSON for', email, err.message);
        continue;
      }

      for (const entry of entries) {
        const { timestamp, audio_file, transcription, type, logStatus } = entry;

        if (!transcription) {
          continue;
        }

        const existing = await Log.findOne({
          userId: user._id,
          'data.transcription': transcription,
          'audio.localPath': audio_file || null,
        });

        if (existing) {
          continue;
        }

        const createdAt = timestamp ? new Date(timestamp) : new Date();

        const log = new Log({
          type: type || 'note',
          userId: user._id,
          milkshakeUserId: user.milkshakeUserId || undefined,
          data: {
            transcription,
            timestamp: createdAt,
            source: 'trigger-word',
            raw: entry,
          },
          audio: {
            localPath: audio_file || null,
            recordedAt: createdAt,
          },
          status: logStatus === 'approved' ? 'approved' : 'pending',
        });

        log.createdAt = createdAt;
        log.updatedAt = createdAt;

        await log.save();
        totalImported += 1;
      }
    }

    if (totalImported > 0) {
      console.log(`Trigger-word import job: imported ${totalImported} new logs for ${usersProcessed} users.`);
    }

    return { imported: totalImported, usersProcessed };
  } catch (err) {
    console.error('Trigger-word import job error:', err);
    return { imported: 0, usersProcessed: 0, error: err.message };
  } finally {
    isRunning = false;
  }
}

module.exports = { importCommandLogsOnce };
