const playBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theatre-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const miniPlayerBtn = document.querySelector(".mini-player-btn");
const video = document.querySelector("video");
const videoContainer = document.querySelector(".video-container");
const muteButton = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
const currentTime = document.querySelector(".current-time");
const totalaTime = document.querySelector(".total-time");
const captionsBtn = document.querySelector(".captions-btn");
const speedBtn = document.querySelector(".speed-btn");
const previewImg = document.querySelector(".preview-img");
const thumbnailImg = document.querySelector(".thumbnail-img");
const timeLineContainer = document.querySelector(".timeline-container");

// TimeLine

timeLineContainer.addEventListener("mousemove", handleTimelineUpdate);
timeLineContainer.addEventListener("mousedown", toggleScrubbing);

let isScrubbing = false;
let wasPaused;

document.addEventListener("mouseup", (e) => {
  if (isScrubbing) toggleScrubbing(e);
});

document.addEventListener("mousemove", (e) => {
  if (isScrubbing) handleTimelineUpdate(e);
});

function toggleScrubbing(e) {
  const rect = timeLineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  isScrubbing = (e.buttons & 1) === 1;
  videoContainer.classList.toggle("scrubbing", isScrubbing);
  if (isScrubbing) {
    wasPaused = video.paused;
    video.pause();
  } else {
    video.currentTime = percent * video.duration;
    if (!wasPaused) video.play();
  }
  handleTimelineUpdate(e);
}

function handleTimelineUpdate(e) {
  const rect = timeLineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  const previewImgNumber = Math.max(
    1,
    Math.floor((percent * video.duration) / 10)
  );

  // нет изображений
  // const previewImage = `/assets/previewIms/preview${previewImgNumber}.jpg`;
  // previewImg.src = previewImage;

  timeLineContainer.style.setProperty("--preview-position", percent);

  if (isScrubbing) {
    e.preventDefault();
    // thumbnailImg.src = previewImage;
    timeLineContainer.style.setProperty("--progress-position", percent);
  }
}
// ===================

playBtn.addEventListener("click", togglePlayPause);

document.addEventListener("keydown", (e) => {
  const tagName = document.activeElement.tagName.toLowerCase();

  if (tagName === "input") return;
  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return;
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
    case "m":
      toggleMute();
      break;
    case "arrowleft":
    case "j":
      skip(-5);
      break;
    case "arrowright":
    case "l":
      skip(5);
      break;
    case "c":
      toggleCaptions();
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

muteButton.addEventListener("click", toggleMute);

volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
});

function toggleMute() {
  video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeLevel = "muted";
    volumeSlider.value = 0;
  } else if (video.volume >= 0.5) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  }

  videoContainer.dataset.volumeLevel = volumeLevel;
});

video.addEventListener("loadeddata", () => {
  totalaTime.textContent = formatDuration(video.duration);
});

video.addEventListener("timeupdate", () => {
  currentTime.textContent = formatDuration(video.currentTime);
  const percent = video.currentTime / video.duration;
  timeLineContainer.style.setProperty("--progress-position", percent);
});

const leadingZeroFormater = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});
function formatDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time / 60) % 60);
  const hourse = Math.floor((time / 3600) & 60);

  if (hourse === 0) {
    return `${minutes}:${leadingZeroFormater.format(seconds)}`;
  } else {
    return `${hourse}:${leadingZeroFormater.format(
      minutes
    )}:${leadingZeroFormater.format(seconds)}`;
  }
}

function skip(duration) {
  video.currentTime += duration;
}

const captions = video.textTracks[0];
captions.mode = "hidden";
captionsBtn.addEventListener("click", toggleCaptions);

function toggleCaptions() {
  const isHidden = captions.mode === "hidden";
  console.log("isHidden: ", isHidden);
  captions.mode = isHidden ? "showing" : "hidden";
  videoContainer.classList.toggle("captions", isHidden);
}

speedBtn.addEventListener("click", changePlaybackSpeed);

function changePlaybackSpeed() {
  let newPlaybackSpeed = video.playbackRate + 0.25;
  if (newPlaybackSpeed > 2) newPlaybackSpeed = 0.25;
  video.playbackRate = newPlaybackSpeed;
  speedBtn.textContent = `${newPlaybackSpeed}x`;
}

// 1:18:15
