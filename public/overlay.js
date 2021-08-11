const socket = io("http://localhost:3005");
const alertBox = document.getElementById("alert-box");

//#region Functions

const createAlertVideo = (src) => {
  const video = document.createElement("video");
  video.classList.add("alert-box-video");

  video.src = src;
  video.controls = false;
  video.autoplay = true;
  video.volume = 0.05;

  return video;
};

const createAlertText = (username) => {
  const textBox = document.createElement("div");
  textBox.classList.add("alert-box-text");

  for (let i = 0; i < username.length; i++) {
    const span = document.createElement("span");
    span.style = `--i:${i + 1};`;
    span.textContent = username[i];
    textBox.appendChild(span);
  }

  textBox.append(" se ha unido al equipo como junior!!");

  return textBox;
};

//#endregion

//#region Events

socket.on("follow", (username) => {
  const video = createAlertVideo("/video/Soy programador.mp4");
  const textBox = createAlertText(username);

  alertBox.appendChild(video);
  alertBox.appendChild(textBox);

  function deleteAlert() {
    video.removeEventListener("ended", deleteAlert);

    alertBox.removeChild(video);
    alertBox.removeChild(textBox);
  }

  video.addEventListener("ended", deleteAlert);
});

//#endregion
