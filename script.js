// Global variables
let audio = new Audio();
let currentSongIndex = -1;
let isPlaying = false;
let isRepeat = false;
let playlist = [];  // Unused in this version
let currentPlaylist = []; // [{ title, src, cover }]


// Elements
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const nowPlaying = document.getElementById('nowPlaying');
const songCover = document.getElementById('songCover');
const progressBar = document.getElementById('progressBar');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Functions
function playSong(index) {
  if (index < 0 || index >= currentPlaylist.length) return;

  currentSongIndex = index;
  const song = currentPlaylist[index];

  audio.src = song.src;
  audio.play();
  isPlaying = true;

  updateMusicBar();
  updatePlayPauseBtn();

  // Set song cover image
  songCover.src = song.cover || 'default.jpg';
}

function updateMusicBar() {
  if (currentSongIndex >= 0 && currentSongIndex < currentPlaylist.length) {
    nowPlaying.textContent = `🎵 ${currentPlaylist[currentSongIndex].title}`;
  } else {
    nowPlaying.textContent = "Select a song to play";
  }
}

function updatePlayPauseBtn() {
  const icon = document.getElementById('playPauseIcon');
  icon.src = isPlaying ? 'pause.png' : 'strt.png';
}

// Control button listeners
playPauseBtn?.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    if (!audio.src && currentPlaylist.length > 0) {
      playSong(0);
    } else {
      audio.play();
      isPlaying = true;
    }
  }
  updatePlayPauseBtn();
});

prevBtn?.addEventListener('click', () => {
  if (currentPlaylist.length === 0) return;
  if (isRepeat) {
    playSong(currentSongIndex);
  } else {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = currentPlaylist.length - 1;
    playSong(newIndex);
  }
});

nextBtn?.addEventListener('click', () => {
  if (currentPlaylist.length === 0) return;
  if (isRepeat) {
    playSong(currentSongIndex);
  } else {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= currentPlaylist.length) newIndex = 0;
    playSong(newIndex);
  }
});

repeatBtn?.addEventListener('click', () => {
  isRepeat = !isRepeat;
  const repeatIcon = document.getElementById('repeatIcon');
  repeatIcon.src = isRepeat ? 'repeat-on.png' : 'repeat.png';
});

// When song ends
audio.addEventListener('ended', () => {
  if (isRepeat) {
    playSong(currentSongIndex);
  } else {
    nextBtn.click();
  }
});

// Progress bar update
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progressBar.max = Math.floor(audio.duration);
    progressBar.value = Math.floor(audio.currentTime);
  }
});

// Seek on input
progressBar?.addEventListener('input', () => {
  audio.currentTime = progressBar.value;
});

// Play from card buttons
document.querySelectorAll('.play-icon, .play-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    let songItem = btn.closest('.song-item, .card, .card.song-card, .card.artist-card');
    if (!songItem) return;

    // Determine song details
    let src = songItem.dataset.src;
    let title = songItem.querySelector('span, p')?.textContent || "Unknown Song";
    let cover = songItem.dataset.cover || 'default.jpg';

    if (!src) return;

    // Update cover image in the music bar
    const coverImg = document.getElementById('songCover');
    if (coverImg) {
      coverImg.src = cover;
    }

    // Update playlist and play
    currentPlaylist = [{ title, src, cover }];
    playSong(0);
  });
});


// Search functionality
searchBtn?.addEventListener('click', () => {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) return;

  document.querySelectorAll('.artist-card, .song-card').forEach(card => {
    const text = card.querySelector('p')?.textContent.toLowerCase() || '';
    card.style.display = text.includes(query) ? 'block' : 'none';
  });
});

// Playlist form handling
const playlistForm = document.getElementById('playlistForm');
const playlistsContainer = document.getElementById('playlistsContainer');

playlistForm?.addEventListener('submit', e => {
  e.preventDefault();
  const playlistNameInput = document.getElementById('playlistName');
  const name = playlistNameInput.value.trim();
  if (!name) return;

  const playlistDiv = document.createElement('div');
  playlistDiv.className = 'playlist-item';
  playlistDiv.textContent = name;
  playlistsContainer.appendChild(playlistDiv);

  playlistNameInput.value = '';
});

// Scroll buttons (if used)
function scrollRight(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollLeft += 300;
  }
}

function scrollLeft(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollLeft -= 300;
  }
}

// Initialize
function init() {
  updateMusicBar();
  updatePlayPauseBtn();
}
init();
