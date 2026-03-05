#!/usr/bin/env python3
"""
Setup Script for Voice-to-Text Integration with Trigger Word Listener
This script helps configure and test the complete system
"""

import os
import sys
import subprocess
from pathlib import Path
import json
import numpy as np
import sounddevice as sd

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    print(f"Python version: {version.major}.{version.minor}.{version.micro}")
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print("❌ Python 3.7+ is required")
        return False
    print("✅ Python version OK")
    return True

def check_audio_devices():
    """List and verify audio devices"""
    print("\n🎤 Audio Devices:")
    print("-" * 50)
    devices = sd.query_devices()
    
    input_devices = []
    for i, device in enumerate(devices):
        if device['max_input_channels'] > 0:
            input_devices.append(i)
            print(f"  [{i}] {device['name']} - {device['max_input_channels']} channels")
    
    if not input_devices:
        print("❌ No input devices found!")
        return False
    
    print(f"\n✅ Found {len(input_devices)} input device(s)")
    
    # Check if device index 1 exists (as used in listener.py)
    if 1 in input_devices:
        print(f"✅ Device index 1 is available (used by listener.py)")
    else:
        print(f"⚠️  Device index 1 not found. Available indices: {input_devices}")
        print("   You may need to update INPUT_DEVICE_INDEX in listener.py")
    
    return True

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing Dependencies:")
    print("-" * 50)
    
    required_packages = [
        'numpy',
        'scipy',
        'sounddevice',
        'tensorflow',
        'librosa',
        'openai-whisper',
        'pydub',
        'gtts'
    ]
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package} - already installed")
        except ImportError:
            print(f"📥 Installing {package}...")
            try:
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
                print(f"✅ {package} - installed successfully")
            except subprocess.CalledProcessError:
                print(f"❌ Failed to install {package}")
                return False
    
    return True

def check_model_files():
    """Check for required model files"""
    print("\n🤖 Checking Model Files:")
    print("-" * 50)
    
    files_status = {
        'best.keras': 'Trigger word detection model',
        'norm_mean.npy': 'Normalization mean values',
        'norm_std.npy': 'Normalization std values'
    }
    
    all_present = True
    for file, description in files_status.items():
        if Path(file).exists():
            print(f"✅ {file} - {description}")
        else:
            print(f"❌ {file} - {description} (MISSING)")
            all_present = False
    
    if not all_present:
        print("\n⚠️  Some model files are missing!")
        print("   Please run your trigger word training script first.")
        return False
    
    return True

def test_whisper():
    """Test Whisper installation"""
    print("\n🎙️ Testing Whisper:")
    print("-" * 50)
    
    try:
        import whisper
        print("✅ Whisper imported successfully")
        
        print("Loading base model (this may take a moment on first run)...")
        model = whisper.load_model("base")
        print("✅ Whisper model loaded successfully")
        
        return True
    except Exception as e:
        print(f"❌ Whisper test failed: {e}")
        print("\nTry installing with: pip install openai-whisper")
        return False

def create_test_audio():
    """Create a test audio file"""
    print("\n🔊 Creating Test Audio:")
    print("-" * 50)
    
    try:
        from gtts import gTTS
        
        # Create test audio
        text = "This is a test of the voice to text system"
        tts = gTTS(text=text, lang='en')
        tts.save("test_audio.mp3")
        
        # Convert to WAV
        from pydub import AudioSegment
        audio = AudioSegment.from_mp3("test_audio.mp3")
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export("test_audio.wav", format="wav")
        
        # Clean up MP3
        os.remove("test_audio.mp3")
        
        print("✅ Test audio created: test_audio.wav")
        print(f"   Text: '{text}'")
        
        return True
    except Exception as e:
        print(f"❌ Failed to create test audio: {e}")
        return False

def test_transcription():
    """Test Whisper transcription"""
    print("\n📝 Testing Transcription:")
    print("-" * 50)
    
    if not Path("test_audio.wav").exists():
        print("⚠️  Test audio not found. Skipping transcription test.")
        return False
    
    try:
        import whisper
        
        model = whisper.load_model("base")
        result = model.transcribe("test_audio.wav")
        
        print(f"✅ Transcription successful!")
        print(f"   Result: '{result['text'].strip()}'")
        
        return True
    except Exception as e:
        print(f"❌ Transcription test failed: {e}")
        return False

def setup_directories():
    """Create necessary directories"""
    print("\n📁 Setting Up Directories:")
    print("-" * 50)
    
    directories = [
        'voice_logs',
        'trigger_logs',
        'synthetic_data'
    ]
    
    for dir_name in directories:
        dir_path = Path(dir_name)
        dir_path.mkdir(exist_ok=True)
        print(f"✅ {dir_name}/ - ready")
    
    return True

def create_config():
    """Create configuration file"""
    print("\n⚙️ Creating Configuration:")
    print("-" * 50)
    
    config = {
        'audio': {
            'input_device_index': 1,
            'sample_rate': 16000,
            'chunk_size': 1024,
            'window_sec': 2.5,
            'threshold': 0.5
        },
        'whisper': {
            'model_size': 'base',
            'language': 'en'
        },
        'paths': {
            'model_path': 'best.keras',
            'mean_path': 'norm_mean.npy',
            'std_path': 'norm_std.npy',
            'log_dir': 'voice_logs',
            'trigger_log_dir': 'trigger_logs'
        },
        'features': {
            'log_triggers': True,
            'save_audio': True,
            'cooldown_period': 3.0,
            'max_record_seconds': 5
        }
    }
    
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Configuration saved to config.json")
    print("   You can edit this file to customize settings")
    
    return True

def test_integration():
    """Test the integration between listener and log scripts"""
    print("\n🔗 Testing Integration:")
    print("-" * 50)
    
    # Check if both scripts exist
    scripts = ['listener.py', 'log.py']
    for script in scripts:
        if Path(script).exists():
            print(f"✅ {script} - found")
        else:
            print(f"❌ {script} - not found")
            return False
    
    print("\n✅ Integration files ready")
    print("   The system will work as follows:")
    print("   1. listener.py detects trigger word")
    print("   2. listener.py calls log.py")
    print("   3. log.py records and transcribes voice command")
    print("   4. Command is processed and logged")
    
    return True

def print_instructions():
    """Print usage instructions"""
    print("\n" + "="*60)
    print("📚 USAGE INSTRUCTIONS")
    print("="*60)
    
    print("\n1. START THE LISTENER:")
    print("   python listener.py")
    print("   (or use listener_enhanced.py for more features)")
    
    print("\n2. TRIGGER THE SYSTEM:")
    print("   Say your trigger word (that you trained the model with)")
    
    print("\n3. GIVE A COMMAND:")
    print("   After trigger detection, speak your command")
    print("   The system will record for up to 5 seconds")
    print("   Recording stops automatically when you stop speaking")
    
    print("\n4. VIEW LOGS:")
    print("   - Voice commands: voice_logs/command_log.json")
    print("   - Trigger events: trigger_logs/triggers_YYYYMMDD.json")
    print("   - Audio files: voice_logs/command_*.wav")
    
    print("\n5. CUSTOMIZE:")
    print("   Edit config.json to change settings")
    print("   Edit log.py to add new commands")
    
    print("\n" + "="*60)

def main():
    """Main setup routine"""
    print("="*60)
    print("🚀 VOICE-TO-TEXT SETUP")
    print("="*60)
    
    # Run all checks
    checks = [
        ("Python Version", check_python_version),
        ("Audio Devices", check_audio_devices),
        ("Dependencies", install_dependencies),
        ("Model Files", check_model_files),
        ("Whisper", test_whisper),
        ("Directories", setup_directories),
        ("Configuration", create_config),
        ("Test Audio", create_test_audio),
        ("Transcription", test_transcription),
        ("Integration", test_integration)
    ]
    
    all_passed = True
    results = []
    
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
            if not result:
                all_passed = False
        except Exception as e:
            print(f"❌ {name} check failed with error: {e}")
            results.append((name, False))
            all_passed = False
    
    # Print summary
    print("\n" + "="*60)
    print("📊 SETUP SUMMARY")
    print("="*60)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    if all_passed:
        print("\n🎉 Setup completed successfully!")
        print_instructions()
    else:
        print("\n⚠️  Some checks failed. Please address the issues above.")
        print("   You may still be able to run the system with reduced functionality.")
    
    print("\n" + "="*60)
    print("Setup complete!")
    print("="*60)

if __name__ == "__main__":
    main()
