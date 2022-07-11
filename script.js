var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

class QueryString{
    #query;
    constructor(df=true){
        let query = window.location.search;
        query = query.split('&').map((self)=>{
            if (self[0]==='?'){
                self = self.slice(1)
            }
            let [key, value] = self.split('=')
            if (!value) value = df;
            return [key, value]
        })
        this.#query = Object.fromEntries(query);
    }

    get(key){
        return this.#query[key];
    }

    isset(key){
        return key in this.#query;
    }
}

const query = new QueryString();

var player;
var sound;
function onYouTubeIframeAPIReady() {
    if (query.isset('play') && query.isset('v') && query.isset('s')){
        createPlayer(query.get('v'), query.get('s'))
        document.querySelector('.form').remove();
    }
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function load(){
    vid = youtube_parser(document.querySelector('input[name=video]').value);
    sid = youtube_parser(document.querySelector('input[name=sound]').value);
    if (vid && sid) createPlayer(vid, sid);
    else {
        if (!vid) document.querySelector('input[name=video]').style.borderColor = 'red';
        if (!sid) document.querySelector('input[name=sound]').style.borderColor = 'red';
    }
}

function createPlayer(vid, sid){
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: vid,
        playerVars: {
          'playsinline': 1,
          'controls': 1,
        },
        events: {
          'onStateChange': onPlayerStateChange,
        }
      });
    sound = new YT.Player('sound', {
          height: '0',
          width: '0',
          videoId: sid,
          playerVars: {
            'playsinline': 1,
            'controls': 0,
          },
    }); 
    document.querySelector('input[name=share]').value = window.location.origin + window.location.pathname + `?play&v=${vid}&s=${sid}`;
}

function play() {
    player.mute();
    sound.playVideo();
    interval = setInterval(() => {
        if (Math.abs(player.getCurrentTime() - sound.getCurrentTime()) > 1) {
            sound.seekTo(player.getCurrentTime());
        }
    },500)
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        play();
    }
    else if (event.data == YT.PlayerState.ENDED) {
        sound.stopVideo();
    }
    else if (event.data == YT.PlayerState.PAUSED) {
        sound.pauseVideo();
        clearInterval(interval);
    }
}