require('dotenv').config();

const path = require('path');
const fs = require('fs');

const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Log = require('../src/models/Log');

async function importCommandLogs() {
  try {
    await connectDB();

    const commandLogsDir = path.join(__dirname, '../src/Trigger-word/command_logs');

    if (!fs.existsSync(commandLogsDir)) {
      console.error('command_logs directory not found at', commandLogsDir);
      process.exit(1);
    }

    const files = fs.readdirSync(commandLogsDir).filter((f) => f.endsWith('.json'));

    if (files.length === 0) {
      console.log('No JSON files found in command_logs');
      process.exit(0);
    }

    let totalImported = 0;

    for (const file of files) {
      const email = file.replace(/\.json$/i, '').toLowerCase();
      const filePath = path.join(commandLogsDir, file);

      console.log(`\nProcessing file: ${file} (email: ${email})`);

      const user = await User.findOne({ email });
      if (!user) {
        console.warn(`  Skipping: no user found with email ${email}`);
        continue;
      }

      let entries;
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        entries = JSON.parse(raw);
        if (!Array.isArray(entries)) {
          console.warn('  Skipping: JSON is not an array');
          continue;
        }
      } catch (err) {
        console.error('  Error reading/parsing JSON:', err.message);
        continue;
      }

      let importedForUser = 0;

      for (const entry of entries) {
        const { timestamp, audio_file, transcription, type, logStatus } = entry;

        if (!transcription) {
          console.warn('  Skipping entry without transcription');
          continue;
        }

        // Basic deduplication: same user, transcription, and audio file
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

        // Override timestamps so they match the original capture time
        log.createdAt = createdAt;
        log.updatedAt = createdAt;

        await log.save();
        importedForUser += 1;
        totalImported += 1;
      }

      console.log(`  Imported ${importedForUser} new logs for ${email}`);
    }

    console.log(`\nDone. Total new logs imported: ${totalImported}`);
    process.exit(0);
  } catch (err) {
    console.error('Import error:', err);
    process.exit(1);
  }
}

importCommandLogs();
