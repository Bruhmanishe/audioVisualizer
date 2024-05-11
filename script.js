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

      let img = new Image();
      img.src = "img/anarchy.png";
      img.width = 367;
      img.height = 365;

      // audio1.src = "audio/Products.mp3";
      audio1.play();
      const audioCtx = new AudioContext();
      audioSource = audioCtx.createMediaElementSource(audio1);
      analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);

      analyser.fftSize = 64;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const barWidth = audioCanvas.width / bufferLength;
      let barHeight;

      let x;

      function animate() {
        canvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
        analyser.getByteFrequencyData(dataArray);
        x = 0;
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] * 4;
          canvasCtx.fillStyle = "red";
          canvasCtx.fillRect(
            x,
            audioCanvas.height - barHeight,
            barWidth,
            barHeight
          );
          x += barWidth - 3;
        }
        canvasCtx.beginPath();
        canvasCtx.drawImage(
          img,
          audioCanvas.width / 2 -
            img.width / 2 -
            img.width * (dataArray[1] / 3000),
          audioCanvas.height / 2 -
            img.height / 2 -
            img.height * (dataArray[1] / 3000),
          img.width * (1 + dataArray[1] / 3000),
          img.height * (1 + dataArray[1] / 3000)
        );
        requestAnimationFrame(animate);
      }

      animate();
    };
  });
};
