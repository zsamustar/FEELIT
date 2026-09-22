export const state = {
  emocionElegida: null,
  purchased: false,
  audioPlayer: null,
  audioEmotion: null,
};

export const emotions = {
  felicidad: {
    name: "FELIZ",
    label: "Felicidad",
    color: 0xffca45,
    css: "#ffd34d",
    audio: "./audio/alegria.wav",
  },
  tristeza: {
    name: "TRISTE",
    label: "Tristeza",
    color: 0x8877f2,
    css: "#9585ff",
    audio: "./audio/tristeza.mp3",
  },
};

export function selectedEmotion() {
  return emotions[state.emocionElegida] || emotions.felicidad;
}
