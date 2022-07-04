const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STRORAGE_KEY = "F8_PLAYER";
const playlist = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playbtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextbtn = $(".btn-next");
const prevbtn = $(".btn-prev");
const randombtn = $(".btn-random");
const repeatbtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  //JSON.parse(localStorage.getItem('PLAYER_STRORAGE_KEY')) ||{},
  songs: [
    {
      name: "Vì mẹ anh bắt chia tay",
      singer: "Miu Lê, Karik",
      path: "./assets/album/song3.mp3",
      image: "./assets/img/anh3.jpg",
    },
    {
      name: "Lạc chốn hồng trần",
      singer: "Lã Phong Lâm",
      path: "./assets/album/song1.mp3",
      image: "./assets/img/anh1.jpg",
    },
    {
      name: "Bài này chill phết",
      singer: "Đen ft.MIN",
      path: "./assets/album/song2.mp3",
      image: "./assets/img/anh2.jpg",
    },
    {
      name: "Đã lỡ yêu em nhiều",
      singer: "JustaTee x Phương Ly",
      path: "./assets/album/song4.mp3",
      image: "./assets/img/anh4.jpg",
    },
    {
      name: "Buông đôi tay nhau ra",
      singer: "Sơn Tùng M-TP",
      path: "./assets/album/song5.mp3",
      image: "./assets/img/anh5.jpg",
    },
    {
      name: "Hãy ra khỏi người đó đi",
      singer: "Phan Mạnh Quỳnh",
      path: "./assets/album/song6.mp3",
      image: "./assets/img/anh6.jpg",
    },
    {
      name: "Níu Duyên",
      singer: "Lê Bảo Bình",
      path: "./assets/album/song7.mp3",
      image: "./assets/img/anh7.jpg",
    },
    {
      name: "Thay tôi yêu cô ấy",
      singer: "Thanh Hưng",
      path: "./assets/album/song8.mp3",
      image: "./assets/img/anh8.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    //localStorage.setItem(PLAYER_STRORAGE_KEY,this.config)
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                    <div class="song ${
                      index === this.currentIndex ? "active" : ""
                    }" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
        `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //xu ly CD quay va Dung
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    //lang nghe su kien keo thanh

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;

      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };
    //xu ly khi play
    playbtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      } else {
        _this.isPlaying = true;
        audio.play();
        player.classList.add("playing");
        cdThumbAnimate.play();
      }
    };

    //khi song duoc playlist

    //khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //xu ly khi tua song duoc playlist
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //khi next song duoc playlist
    nextbtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    prevbtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //xu ly random bat tat random song
    randombtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randombtn.classList.toggle("active", _this.isRandom);
    };
    //xu ly lap lai song
    repeatbtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatbtn.classList.toggle("active", _this.isRepeat);
    };
    //xu ly next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextbtn.click();
      }
    };
    //lang nghe hanh vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    this.loadConfig();
    //dinh nghia cac thuoc tinh cho object
    this.defineProperties();

    //lang nghe xu ly cac su kien
    this.handleEvents();
    //tai thong tin bai dau tien
    this.loadCurrentSong();
    //render playlist
    this.render();
    //hien thi trang thai ban dau random repeat

    randombtn.classList.toggle("active", this.isRandom);
    repeatbtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
