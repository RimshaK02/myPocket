import time
import numpy as np
import sounddevice as sd
import tensorflow as tf
import librosa
import collections
import subprocess 
import sys 

INPUT_DEVICE_INDEX = 1    
WINDOW_SEC = 2.5           
CHUNK_SEC = 0.25           
THRESHOLD = 0.5    

SR = 16000
MODEL_PATH = "best.keras"
MEAN_PATH = "norm_mean.npy"
STD_PATH = "norm_std.npy"
N_FFT, HOP, WIN, N_MELS = 512, 160, 400, 64
FMIN, FMAX = 50, 7600


BUFFER_LEN_SAMPLES = int(WINDOW_SEC * SR)
audio_buffer = collections.deque(maxlen=BUFFER_LEN_SAMPLES)


print("Loading model and normalization stats...")
original_model = tf.keras.models.load_model(MODEL_PATH, compile=False)
X_mean = np.load(MEAN_PATH)
X_std = np.load(STD_PATH)


fixed_len_frames = (BUFFER_LEN_SAMPLES - N_FFT) // HOP + 1
print(f"Window is {WINDOW_SEC}s, resulting in {fixed_len_frames} spectrogram frames.")
fixed_input = tf.keras.layers.Input(shape=(fixed_len_frames, N_MELS))
fixed_output = original_model(fixed_input)
model = tf.keras.Model(fixed_input, fixed_output)
print("Model loaded successfully.")

def compute_logmel_from_buffer(buffer: np.ndarray) -> np.ndarray:
    S = librosa.feature.melspectrogram(y=buffer, sr=SR, n_fft=N_FFT, hop_length=HOP, win_length=WIN, window="hann", n_mels=N_MELS, fmin=FMIN, fmax=FMAX, power=2.0, center=False)
    return np.log1p(S).T

def run_log_script():
    """Runs the log.py script in a new process."""
    print("\n--> Trigger word detected! Running log.py...")
    try:
        # Use Popen to run non-blockingly, so the listener can continue
        subprocess.Popen(["python", "log.py"])
    except FileNotFoundError:
        print("--> ERROR: 'python' command not found or 'log.py' not in the same directory.")
    except Exception as e:
        print(f"--> ERROR: Failed to run log.py: {e}")

def audio_callback(indata, frames, time, status):
    """This function is called by the sound device for each new audio chunk."""
    if status:
        print(status, file=sys.stderr)
    
    audio_buffer.extend(indata[:, 0])

def main_listener():
    
    for _ in range(BUFFER_LEN_SAMPLES):
        audio_buffer.append(0.0)
        
    last_trigger_time = 0
    print(f"\nListening on device {INPUT_DEVICE_INDEX}... (Interrupt kernel to stop)")

    
    with sd.InputStream(device=INPUT_DEVICE_INDEX, channels=1, samplerate=SR, callback=audio_callback, latency='high'):
        while True:
            try:
                #print('Listening')
                buffer_snapshot = np.array(audio_buffer, dtype=np.float32)
                
               
                if len(buffer_snapshot) != BUFFER_LEN_SAMPLES:
                    time.sleep(CHUNK_SEC)
                    continue

                
                feats = compute_logmel_from_buffer(buffer_snapshot)
                x_norm = (feats[None, ...] - X_mean) / (X_std + 1e-8)
                preds = model.predict(x_norm, verbose=0)[0, :, 0]
                max_p = float(preds.max())

                print(f"Max Prediction: {max_p:.4f}", end='\r')

                now = time.time()
                if max_p > THRESHOLD and (now - last_trigger_time) > 2.0: 
                    #print(f"\nTRIGGER DETECTED!")
                    run_log_script()
                    break

                
                time.sleep(CHUNK_SEC)
                
            except KeyboardInterrupt:
                print("\nListener stopped by user.")
                break
            except Exception as e:
                print(f"\nAn error occurred in the loop: {e}")
                break

# Start the listener
main_listener()
