"""Sintetiza una lista de trabajos con Piper, cargando el modelo una sola vez.

Entrada por stdin: una línea JSON por trabajo: {"text": "...", "wav": "ruta"}.
Uso: uv run --with piper-tts python scripts/tts-worker.py <modelo.onnx>
"""

import json
import sys
import wave

from piper import PiperVoice, SynthesisConfig

model = sys.argv[1]
voice = PiperVoice.load(model)
rate = voice.config.sample_rate

for line in sys.stdin.buffer:
    line = line.strip()
    if not line:
        continue
    job = json.loads(line.decode("utf-8"))
    config = SynthesisConfig(length_scale=float(job.get("lengthScale", 1.0)))
    with wave.open(job["wav"], "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(rate)
        voice.synthesize_wav(job["text"], out, syn_config=config, set_wav_format=False)
    print(job["wav"], flush=True)
