const playBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theatre-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const miniPlayerBtn = document.querySelector(".mini-player-btn");
const video = document.querySelector("video");
const videoContainer = document.querySelector(".video-container");

playBtn.addEventListener("click", togglePlayPause);

document.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case " ":
    case "k":
      togglePlayPause();
      break;
    case "f":
      toggleFullScreenMode();
      break;
    case "t":
      toggleTheaterMode();
      break;
    case "i":
      toggleMiniPlayerMode();
      break;
  }
});

video.addEventListener("click", togglePlayPause);

function togglePlayPause() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});

theaterBtn.addEventListener("click", toggleTheaterMode);
fullScreenBtn.addEventListener("click", toggleFullScreenMode);
miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);

function toggleTheaterMode() {
  videoContainer.classList.toggle("theatre");
}
function toggleFullScreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener("fullscreenchange", () => {
  videoContainer.classList.toggle("full-screen");
});

function toggleMiniPlayerMode() {
  if (videoContainer.classList.contains("mini-player")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
}

video.addEventListener("enterpictureinpicture", () => {
  videoContainer.classList.add("mini-player");
});

video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("mini-player");
});
