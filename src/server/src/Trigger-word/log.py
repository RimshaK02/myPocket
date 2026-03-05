#!/usr/bin/env python3
"""
Voice-to-Text Logger
Activated by listener.py when trigger word is detected
Records audio and transcribes using Whisper
"""

import time
import numpy as np
import sounddevice as sd
import collections
import sys
import os
from datetime import datetime
import json
import wave
import threading
from pathlib import Path
import subprocess
from text_to_json import parse_command

# Audio parameters matching listener.py
INPUT_DEVICE_INDEX = 1
SR = 16000  # Sample rate matching listener.py
RECORD_SECONDS = 10  # Maximum recording duration after trigger
CHUNK_SIZE = int(SR * 0.1)  # 100ms chunks

# Whisper imports
try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    print("Warning: Whisper not installed. Install with: pip install openai-whisper")
    WHISPER_AVAILABLE = False

# For Voice Activity Detection
class VoiceActivityDetector:
    """Simple VAD to detect when user stops speaking"""
    def __init__(self, threshold=0.01, silence_duration=1.0):
        self.threshold = threshold
        self.silence_duration = silence_duration
        self.silence_samples = int(silence_duration * SR)
        self.silence_counter = 0
        self.has_speech = False
        
        
    def is_silence(self, audio_chunk):
        """Check if audio chunk is silence"""
        rms = np.sqrt(np.mean(audio_chunk**2))
        return rms < self.threshold
    
    def should_stop_recording(self, audio_chunk):
        """Determine if we should stop recording based on silence"""
        if not self.is_silence(audio_chunk):
            # We heard speech; reset silence counter and mark that speech occurred
            self.has_speech = True
            self.silence_counter = 0
            return False
        
        # If we've never heard speech yet, ignore leading silence
        if not self.has_speech:
            return False
        
        # We *have* heard speech, now count silence
        self.silence_counter += len(audio_chunk)
        return self.silence_counter >= self.silence_samples

class VoiceToTextLogger:
    """Main voice-to-text logging system"""
    
    def __init__(self, whisper_model_size='base', log_dir='voice_logs'):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
        # Initialize Whisper if available
        self.whisper_model = None
        if WHISPER_AVAILABLE:
            print(f"Loading Whisper {whisper_model_size} model...")
            try:
                self.whisper_model = whisper.load_model(whisper_model_size)
                print("Whisper model loaded successfully!")
            except Exception as e:
                print(f"Error loading Whisper: {e}")
        
        # Audio recording state
        self.is_recording = False
        self.audio_buffer = []
        self.vad = VoiceActivityDetector(silence_duration=3.0)
        
        # Command history
        self.command_history = []
        
    def record_audio(self, duration=RECORD_SECONDS):
        """Record audio after trigger detection"""
        print("\n🎤 Recording... Speak your command now!")
        print("   (Recording will stop after silence or 5 seconds)")
        
        self.audio_buffer = []
        self.vad.silence_counter = 0
        start_time = time.time()
        
        # Callback for audio stream
        def audio_callback(indata, frames, time_info, status):
            if status:
                print(f"Audio status: {status}", file=sys.stderr)
            
            # Add to buffer
            self.audio_buffer.extend(indata[:, 0])
            
            # Check for silence to stop early
            if self.vad.should_stop_recording(indata[:, 0]):
                self.is_recording = False
        
        # Start recording
        self.is_recording = True
        
        with sd.InputStream(
            device=INPUT_DEVICE_INDEX,
            channels=1,
            samplerate=SR,
            callback=audio_callback,
            blocksize=CHUNK_SIZE, 
            latency='high'
        ):
            # Record until silence or timeout
            while self.is_recording and (time.time() - start_time) < duration:
                time.sleep(0.1)
        
        print("⏹️  Recording stopped.")
        
        # Convert buffer to numpy array
        audio_data = np.array(self.audio_buffer, dtype=np.float32)
        
        return audio_data
    
    def save_audio(self, audio_data, filename=None):
        """Save audio to WAV file"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = self.log_dir / f"command_{timestamp}.wav"
        
        # Normalize audio
        if np.max(np.abs(audio_data)) > 0:
            audio_data = audio_data / np.max(np.abs(audio_data))
        
        # Save as WAV
        with wave.open(str(filename), 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)  # 16-bit
            wf.setframerate(SR)
            wf.writeframes((audio_data * 32767).astype(np.int16).tobytes())
        
        return filename
    
    def transcribe_audio(self, audio_data):
        """Transcribe audio using Whisper"""
        if not self.whisper_model:
            return "Whisper not available - please install openai-whisper"
        
        try:
            # Save temporary file for Whisper
            temp_file = self.log_dir / "temp_audio.wav"
            self.save_audio(audio_data, temp_file)
            
            # Transcribe
            print("📝 Transcribing...")
            result = self.whisper_model.transcribe(
                str(temp_file),
                language='en',  # You can make this configurable
                task='transcribe'
            )
            
            # Clean up temp file
            if temp_file.exists():
                os.remove(temp_file)
            
            return result['text'].strip()
            
        except Exception as e:
            print(f"Transcription error: {e}")
            return f"Error: {e}"
    
    
    
    
    def save_log(self, command_data, audio_file):
        """Save command log to file"""
        log_entry = {
            'timestamp': command_data['timestamp'],
            'audio_file': str(audio_file),
            'transcription': command_data['transcription'],
            'action': command_data['action'],
            'parameters': command_data['parameters'],
            'response': command_data.get('response', '')
        }
        
        # Save to JSON log
        log_file = self.log_dir / "command_log.json"
        
        # Load existing log
        if log_file.exists():
            with open(log_file, 'r') as f:
                log_data = json.load(f)
        else:
            log_data = []
        
        # Append new entry
        log_data.append(log_entry)
        
        # Save updated log
        with open(log_file, 'w') as f:
            json.dump(log_data, f, indent=2)
        
        print(f"\n💾 Log saved to: {log_file}")
    def save_parsed_json(self, parsed_data):
        """Save parsed JSON to a separate file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        json_file = self.log_dir / f"parsed_{timestamp}.json"
        
        with open(json_file, 'w') as f:
            json.dump(parsed_data, f, indent=2)
        
        print(f"📄 Parsed JSON saved to: {json_file}")
        return json_file
    def run(self):
        """Main execution flow"""
        print("\n" + "="*50)
        print("🎙️  VOICE-TO-TEXT LOGGER ACTIVATED")
        print("="*50)
        
        try:
            # Record audio
            audio_data = self.record_audio()
            
            if len(audio_data) > 0:
                # Save audio
                audio_file = self.save_audio(audio_data)
                print(f"💾 Audio saved: {audio_file}")
                
                # Transcribe
                transcription = self.transcribe_audio(audio_data)
                print(f"\n📢 You said: \"{transcription}\"")
                
                # Process command
                parsed = parse_command(transcription)
                print("\n📦 Parsed JSON:")
                print(json.dumps(parsed, indent=2))
                parsed_json_file = self.save_parsed_json(parsed)
                # Build a command_data object for logging
                command_data = {
                    'timestamp': datetime.now().isoformat(),
                    'transcription': transcription,
                    'action': 'task',
                    'parameters': parsed,
                    'response': ''  # or something if you want
                }
                
                # Save log
                self.save_log(command_data, audio_file)
                
                # Add to history
                self.command_history.append(command_data)

            else:
                print("⚠️ No audio recorded")
        
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print("\n" + "="*50)
        print("✅ Voice-to-text logging complete!")
        print("="*50)
        
        #subprocess.Popen(["python", "text_to_json.py"])
        # Return to listener
        #print("\n🔄 Returning to listener...")
    
  

def main():
    """Main entry point when called from listener.py"""
    logger = VoiceToTextLogger(whisper_model_size='base')
    logger.run()

if __name__ == "__main__":
    # This will be called when listener.py triggers detection
    main()
