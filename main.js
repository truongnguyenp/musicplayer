const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const songs = [
    {
        name: "Nevada",
        singer: "Vicetone",
        path: "./assets/songs/song1.mp3",
        thumb: "./assets/images/s1.jpg"
    },
    {
        name: "Viva La Vida",
        singer: "Shalom Margaret",
        path: "./assets/songs/song2.mp3",
        thumb: "./assets/images/s2.jpg"
    },
    {
        name: "Something Just Like This",
        singer: "Shalom Margaret",
        path: "./assets/songs/song3.mp3",
        thumb: "./assets/images/s3.jpg"
    },
   
    {
        name: "Bad Habits",
        singer: "Ed Sheeran",
        path: "./assets/songs/song4.mp3",
        thumb: "./assets/images/s4.jpg"
    },
    {
        name: "Bước qua nhau",
        singer: "Vũ",
        path: "./assets/songs/song5.mp3",
        thumb: "./assets/images/s5.jpg"
    },
    {
        name: "Havana",
        singer: "Camila Cabello",
        path: "./assets/songs/song6.mp3",
        thumb: "./assets/images/s6.jpg"
    },
    {
        name: "Counting Star",
        singer: "OneRepublic ",
        path: "./assets/songs/song7.mp3",
        thumb: "./assets/images/s7.jpg"
    },

]
const player = $(".player") 
const playBtn = $(".control .icon-play") 
const repeatBtn = $(".control .btn-repeat");
const prevBtn = $(".control .btn-prev");
const nextBtn = $(".control .btn-next");
const header = $("header h2");
const cdThumb = $(".cd-thumb");
const audio =  $("#audio");
const pauseBtn = $(" .control .icon-pause ")  
const playlist =  $(".playlist") 
const toggleplayBtn = $(".btn.btn-toggle-play")
let progress = $("#progress") 
 
const randomBtn = $(".control .btn-random") 


const app = {
 
    isPlaying:false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    renderPlaylist() {
        progress.value = 0
     const htmls= songs.map(song=> {
          
        return `<div class="song">
            <div class="thumb"
            style="background-image: url('${song.thumb}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <h5 class="author">${song.singer}</h5>
             
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`
        })
        playlist.innerHTML= htmls.join("")

        
    },
   
    
   
    defineProperties() {
        Object.defineProperty(this,'currentSong',{
            get(){
                return songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong() {
        progress.value =0;
        let songActive = document.querySelector(".song.active");
        if (songActive)  songActive.classList.remove("active");
        let element = document.querySelectorAll(".song")[this.currentIndex];
        if(element) element.classList.add("active")
        audio.currentTime=0;
       
        header.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url("${this.currentSong.thumb}")`
 
        audio.src = this.currentSong.path;
       
    },
    handleclickSong() {
        let _this = app;
        let songItems = document.querySelectorAll(".song");
      
        songItems.forEach((element,index) => {
            element.onclick = function() {
             
               
                if(index) _this.currentIndex=index;
                _this.currentIndex=index;
            
               _this.loadCurrentSong();
            
              
                audio.play()
              
            }
        });
    },
    
handleEvent() {
        // Xử lý rotate cdThumb
        const cdThumbAnimate =cdThumb.animate([{transform: "rotate(360deg)"}],
        { duration: 10000,
            iterations: Infinity});
        cdThumbAnimate.pause();   
        //Xử lý sự kiện zoom cdThumb khi scroll
        let cd = $(".cd");
        let cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newCdWidth = cdWidth-scrollTop;
  
            cd.style.width=(newCdWidth>0)? newCdWidth + 'px':0;
            cd.style.opacity = newCdWidth/cdWidth
        }
        //Xử lý sự kiện play /pause 
        let _this = this;
        toggleplayBtn.onclick = function(){
            if(_this.isPlaying){
             
                audio.pause();
               
            } else {
               
                audio.play();
                
            }
          
        }
    audio.onplay = function() {
        _this.isPlaying = true;
        player.classList.add("playing")
        cdThumbAnimate.play();
    }
    audio.onpause = function() {
        _this.isPlaying = false;
        player.classList.remove("playing")
        cdThumbAnimate.pause();
    }
    //Xử lý sự kiện khi play ,tua
    audio.ontimeupdate = function(){
       
        const progressPercent =Math.floor((audio.currentTime/audio.duration)*100);
         progress.value =progressPercent;

    }
    progress.oninput = function(){
        let seekTime = progress.value/100 *audio.duration;
        audio.currentTime = seekTime;
        audio.pause();
    }
    progress.onchange = function(){
        let seekTime = progress.value/100 *audio.duration;
        audio.currentTime = seekTime;
        audio.play();

    }
    nextBtn.onclick = function(){
        if(_this.isRandom){
            _this.randomSong();
       
        }
        else {
            _this.nextSong();
       
        }
        _this.loadCurrentSong();
        audio.play();
        
    },   
    prevBtn.onclick = function(){
        if(_this.isRandom){
            _this.randomSong();
        
        }
        else {
         _this.prevSong();
       
        }
        _this.loadCurrentSong();
        audio.play();
     
  
    },
    randomBtn.onclick = function(){
        _this.isRandom=!_this.isRandom;
        randomBtn.classList.toggle('active')
    },
    repeatBtn.onclick = function(){
        _this.isRepeat=!_this.isRepeat;
        repeatBtn.classList.toggle('active')
    },
    audio.onended= function() {
        if(_this.isRepeat){
            audio.play();
        }
        else nextBtn.click();
    };
    
      
    },
   
    
    nextSong(){
        this.currentIndex++;
        if(this.currentIndex>=songs.length){
            this.currentIndex=0;
        }
  
    },
    prevSong(){
        this.currentIndex--;
        if(this.currentIndex<0){
            this.currentIndex=songs.length-1;
        }
       
    },
    randomSong(){
        let newIndex; 
        do(newIndex=Math.floor(Math.random()*songs.length))
        while(newIndex === this.currentIndex)
        this.currentIndex=newIndex;
    },
    start() {
        // Định nghĩa thuộc tích
        this.defineProperties();
        //Lắng nghe / Xử lý sự kiện DOM
        this.loadCurrentSong();
        this.handleEvent();
        this.renderPlaylist();

        this.handleclickSong();
      
    }
}
app.start();