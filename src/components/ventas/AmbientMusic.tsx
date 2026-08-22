"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHORDS: number[][] = [
  [220.0, 261.63, 329.63, 392.0],
  [174.61, 220.0, 261.63, 329.63],
  [130.81, 164.81, 196.0, 246.94],
  [196.0, 246.94, 293.66, 329.63],
];

const MELODY = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0];

export default function AmbientMusic() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timersRef = useRef<{ chord?: ReturnType<typeof setInterval>; melody?: ReturnType<typeof setInterval> }>({});
  const stepRef = useRef(0);

  const stop = useCallback(() => {
    if (timersRef.current.chord) clearInterval(timersRef.current.chord);
    if (timersRef.current.melody) clearInterval(timersRef.current.melody);
    timersRef.current = {};
    if (masterRef.current) {
      masterRef.current.gain.linearRampToValueAtTime(0.0001, ctxRef.current!.currentTime + 0.5);
    }
    setTimeout(() => {
      ctxRef.current?.close();
      ctxRef.current = null;
      masterRef.current = null;
    }, 600);
    setPlaying(false);
    try { localStorage.setItem("garage_music", "off"); } catch {}
  }, []);

  const start = useCallback(() => {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.09;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1600;
    master.connect(filter).connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;

    const pad = (freqs: number[]) => {
      const now = ctx.currentTime;
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.16, now + 1.2);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);
        osc.connect(g).connect(master);
        osc.start(now);
        osc.stop(now + 4.4);
      });
    };

    const pluck = () => {
      if (Math.random() > 0.55 || !ctxRef.current || !masterRef.current) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = MELODY[Math.floor(Math.random() * MELODY.length)];
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      osc.connect(g).connect(master);
      osc.start(now);
      osc.stop(now + 1.2);
    };

    pad(CHORDS[0]);
    stepRef.current = 1;
    timersRef.current.chord = setInterval(() => {
      pad(CHORDS[stepRef.current % CHORDS.length]);
      stepRef.current += 1;
    }, 4000);
    timersRef.current.melody = setInterval(pluck, 900);
    setPlaying(true);
    try { localStorage.setItem("garage_music", "on"); } catch {}
  }, []);

  useEffect(() => () => stop(), [stop]);

  const toggle = () => (playing ? stop() : start());

  return (
    <button
      onClick={toggle}
      title="Música ambiental en vivo"
      className={`fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold shadow-lg transition ${
        playing
          ? "bg-emerald-500 text-black shadow-emerald-500/30"
          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
      }`}
    >
      {playing ? (
        <>
          <span className="flex items-end gap-0.5" aria-hidden>
            <span className="w-0.5 animate-pulse bg-black" style={{ height: "10px", animationDuration: "0.9s" }} />
            <span className="w-0.5 animate-pulse bg-black" style={{ height: "14px", animationDuration: "0.6s" }} />
            <span className="w-0.5 animate-pulse bg-black" style={{ height: "8px", animationDuration: "1.1s" }} />
          </span>
          Música en vivo · tocar para silenciar
        </>
      ) : (
        <>🎵 Activar música en vivo</>
      )}
    </button>
  );
}
