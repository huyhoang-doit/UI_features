//
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Variables
const playlist = $('.playlist')
const cd = $('.cd')
const cdWidth = cd.offsetWidth
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $(".player");
const progress = $('#progress')
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

// Constant
const PLAYER_STORAGE_KEY = 'HuyHoang_player'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    // List songs
    songs: [
        {
            name: "The Nights",
            singer: "Avicii",
            path: "./assets/music/01.mp3",
            image: "./assets/img/01.jpg"
          },
          {
            name: "Hall Of Fame",
            singer: "The Script",
            path: "./assets/music/02.mp3",
            image: "./assets/img/02.jpg"
          },
          {
            name: "Too Good At Goodbyes",
            singer: "Sam Smith",
            path: "./assets/music/03.mp3" ,
            image: "./assets/img/03.jpg"
          },
          {
            name: "See You Again",
            singer: "Wiz Khalifa ft Charlie Puth",
            path: "./assets/music/04.mp3",
            image: "./assets/img/04.jpg"
          },
          {
            name: "Bad Liar",
            singer: "Imagine Dragons",
            path: "./assets/music/05.mp3",
            image:"./assets/img/05.jpg"
          },
          {
            name: "STAY",
            singer: "The Kid LAROI, Justin BieBer",
            path:"./assets/music/06.mp3",
            image: "./assets/img/06.jpg"
          },
          {
            name: "All of Me",
            singer: "John Legend",
            path: "./assets/music/07.mp3",
            image:"./assets/img/07.jpg"
          },
          {
            name: "Head In The Clouds",
            singer: "Hayd",
            path: "./assets/music/08.mp3",
            image:"./assets/img/08.jpg"
          },
          {
            name: "Like My Father",
            singer: "Jax",
            path: "./assets/music/09.mp3",
            image: "./assets/img/09.jpg"
          },
          {
            name: "Drag Me Down",
            singer: "One Direction",
            path: "./assets/music/10.mp3",
            image:"./assets/img/10.jpg"
          },
          {
            name: "Những Dòng Tin Nhắn",
            singer: "Minh Huy x Pinny",
            path: "./assets/music/11.mp3",
            image:"./assets/img/11.jpg"
          }
    ],

    setConfig: function(key, value) {
        this.config[key]= value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const _this = this;
        const htmls = this.songs.map(function (song, index) {
            return `
            <div class="song ${index === _this.currentIndex ? 'active' : '' }" data-index="${index}">
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
    })
        playlist.innerHTML = htmls.join('');
        
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
          get: function () {
            return this.songs[this.currentIndex];
          }
        });
      },

    

    handleEvent: function() {
        const _this = this
        // handle cd spinning
        const cdThumbAnimate = cdThumb.animate(
          [{ transform: "rotate(369deg" }],
          {
            duration: 10000, // 10 seconds
            iterations: Infinity,
          }
        )
        cdThumbAnimate.pause()


        // handle croll
        document.onscroll = function() {
            const scroll = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scroll
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // handle click play
        playBtn.onclick = function() {
           if(_this.isPlaying) {
            audio.pause()
           }else {
            audio.play()
           }
        }

        // Listen audio
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime/audio.duration *100)
                progress.value = progressPercent
            }
        }
        // handle auto next new song when audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else {
                nextBtn.click()
            }
        }

        // handle the change progress
        progress.onchange = function(e) {
            const seekTime = audio.duration/100 * e.target.value
            audio.currentTime = seekTime
        }

        // handle click next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.crollToActiveSong()        
        }

        // handle click previous song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.crollToActiveSong()

        }

        // handle click random button
        randomBtn.onclick = function () {
            _this.isRandom = ! _this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // handle click repeat button 
        repeatBtn.onclick = function () {
            _this.isRepeat = ! _this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Listen event click on playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            const option = e.target.closest('.option')
            // handle click on song

            if(songNode || option) {
                // click on song 
                if(songNode) {
                  _this.currentIndex =Number(songNode.getAttribute('data-index'))
                  _this.loadCurrentSong()
                  _this.render()
                  audio.play()
                }
                // click on option
                if(option) {

                }
            }
        }


    },
    crollToActiveSong: function () {
        setTimeout(function () {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })
        },500)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        this.defineProperties()
        this.render()
        this.loadConfig()
        this.handleEvent()
        this.loadCurrentSong()
        //
        randomBtn.classList.toggle("active", this.isRandom)
        repeatBtn.classList.toggle("active", this.isRepeat)

    }
}
app.start()