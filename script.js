"use strict";
const audioCanvas = document.getElementById("canvas1");
const container = document.getElementById("container");
const uploadSong = document.getElementById("input1");

const canvasCtx = audioCanvas.getContext("2d");

audioCanvas.width = window.innerWidth;
audioCanvas.height = window.innerHeight;

let audioSource;
let analyser;

let musicPlay = false;

window.onload = () => {
  container.addEventListener("click", function () {
    uploadSong.click();
    uploadSong.onchange = function () {
      const files = this.files;
      const audio1 = document.getElementById("audio1");
      audio1.src = URL.createObjectURL(files[0]);
      audio1.load();
      audio1.play();

      let img = new Image();
      img.src = "img/anarchy.png";
      img.width = 370;
      img.height = 370;

      const audioCtx = new AudioContext();
      audioSource = audioCtx.createMediaElementSource(audio1);
      analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);

      analyser.fftSize = 1024;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const barWidth = audioCanvas.width / bufferLength + 2;
      let barHeight;
      let x;

      function animate() {
        setInterval(() => {
          canvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
          analyser.getByteFrequencyData(dataArray);
          x = 0;

          drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);

          drawImage(img, dataArray, canvasCtx, audioCanvas);
        }, 30);

        // requestAnimationFrame(animate);
      }
      animate();
    };
  });
};

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 4;
    const red = i + barHeight + (Math.random() * (10 - -10) - -10);

    canvasCtx.fillStyle = "rgba(" + red + "," + 0 + "," + 0 + ")";
    canvasCtx.fillRect(x, audioCanvas.height - barHeight, barWidth, barHeight);
    x += barWidth - 1;
  }
}

function drawImage(img, dataArray, canvasCtx, canvas) {
  canvasCtx.beginPath();
  canvasCtx.globalAlpha = dataArray[10] / 190;

  canvasCtx.drawImage(
    img,
    canvas.width / 2 - img.width / 2 - img.width * (dataArray[1] / 3000),
    canvas.height / 2 - img.height / 2 - img.height * (dataArray[1] / 3000),
    img.width * (1 + dataArray[10] / 3000),
    img.height * (1 + dataArray[10] / 3000)
  );
  canvasCtx.closePath();
}
