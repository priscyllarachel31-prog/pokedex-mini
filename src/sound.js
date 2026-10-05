let audioCtx = null;
let currentCry = null;

export function isMuted() {
  try {
    return localStorage.getItem("muted") === "1";
  } catch {
    return false;
  }
}

export function setMuted(muted) {
  try {
    localStorage.setItem("muted", muted ? "1" : "0");
  } catch {
    // abaikan kalau penyimpanan browser tidak tersedia
  }
}

function getContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// Satu "bip": nada dari frekuensi `from` ke `to`, lalu menghilang pelan
function beep({ from, to, start = 0, length = 0.12, type = "sine", volume = 0.12 }) {
  const ctx = getContext();
  if (!ctx) return;

  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + length);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + length + 0.05);
}

const sounds = {
  // tombol biasa
  click: () => beep({ from: 700, to: 450, length: 0.08, type: "triangle" }),
  // mengetik di kolom pencarian
  tick: () => beep({ from: 900, length: 0.03, type: "square", volume: 0.025 }),
  // memilih filter tipe
  filter: () => {
    beep({ from: 520, length: 0.07, type: "square", volume: 0.06 });
    beep({ from: 780, start: 0.06, length: 0.09, type: "square", volume: 0.06 });
  },
  // menambah favorit: tiga nada naik
  like: () => {
    [660, 880, 1320].forEach((freq, i) =>
      beep({ from: freq, start: i * 0.08, length: 0.14, volume: 0.14 })
    );
  },
  // menghapus favorit: nada turun
  unlike: () => beep({ from: 420, to: 220, length: 0.18, type: "triangle" }),
  // membuka kartu Pokemon: efek "whoosh"
  open: () => beep({ from: 220, to: 900, length: 0.2, type: "sawtooth", volume: 0.05 }),
};

export function playSound(name) {
  if (isMuted()) return;
  try {
    sounds[name]?.();
  } catch {
    // suara tidak boleh membuat aplikasi error
  }
}

// Suara asli Pokemon (dari data PokeAPI)
export function playCry(url) {
  if (!url || isMuted()) return;
  try {
    if (currentCry) currentCry.pause();
    currentCry = new Audio(url);
    currentCry.volume = 0.5;
    currentCry.play().catch(() => {
      // browser kadang menolak suara otomatis, tidak apa-apa
    });
  } catch {
    // abaikan
  }
}