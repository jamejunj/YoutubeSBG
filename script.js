var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const charList = [
    {
        name: 'Fatui',
        vid: 'TmaAOV4SJNQ',
        sid: '34jc0Y4bzT0',
        vision: 'None',
    },
    {
        name: 'Shikanoin Heizou',
        vid: 'mp-u0LmUikU',
        sid: '2dFZF056pkc',
        vision: 'Anemo',
    },
    {
        name: 'Kuki Shinobu',
        vid: '13fviLTc0Aw',
        sid: '8pei2OjUc40',
        vision: 'Electro',
    },
    {
        name: 'Kazuha',
        vid: 'zif0Lmhrivc',
        sid: 'ZxLLysD9q6g',
        vision: 'Pyro',
    },
    {
        name: 'Klee',
        vid: 'C_duDk5e8yU',
        sid: '7-VnFQvCLDc',
        vision: 'Pyro',
    },
    {
        name: 'Zhongli',
        vid: '4oBpaBEMBIM',
        sid: 'wO3_S82III0',
        vision: 'Geo',
    },
    {
        name: 'Raiden Shogun',
        vid: 'mvrW4aKwAXw',
        sid: 'iFg-bFAu2AU',
        vision: 'Electro',
    },
    {
        name: 'Hu Tao',
        vid: 'qrH9vMZBwAk',
        sid: 'vRj3YbsVTPc',
        vision: 'Pyro',
    },
    {
        name: 'Ganyu',
        vid: 'FHRXP8ceeBU',
        sid: '_yZTVFSzJC8',
        vision: 'Cryo',
    },
    {
        name: 'Xiao',
        vid: 'sjozpa9DsZU',
        sid: '-tCIg3NQh6Y',
        vision: 'Anemo',
    },
    {
        name: 'Venti',
        vid: 't6BZjmGpq40',
        sid: '0MiIciljaWY',
        vision: 'Anemo',
    }
]

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
        createPlayer(query.get('v'), query.get('s'), (query.isset('lang') ? query.get('lang'): 'en'));
        if (query.isset('share')) document.querySelector('.form').remove();
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
    if (vid && sid){
        if (player && sound){
            change(vid, sid);
        }else{
            createPlayer(vid, sid);
        }
        document.querySelector('input[name=video]').style.borderColor = '';
        document.querySelector('input[name=sound]').style.borderColor = '';
    }else {
        if (!vid) document.querySelector('input[name=video]').style.borderColor = 'red';
        if (!sid) document.querySelector('input[name=sound]').style.borderColor = 'red';
    }
    console.log(vid, sid);
}

function createPlayer(vid, sid, lang='en'){
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: vid,
        playerVars: {
          'playsinline': 1,
          'controls': 1,
          'cc_lang_pref': lang,
        },
        events: {
          'onReady': onReady,
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
    document.querySelector('input[name=share]').value = window.location.origin + window.location.pathname + `?play&v=${vid}&s=${sid}&share`;
}

function play() {
    sound.setVolume(player.getVolume());
    player.mute();
    sound.playVideo();
    interval = setInterval(() => {
        if (Math.abs(player.getCurrentTime() - sound.getCurrentTime()) > 1) {
            sound.seekTo(player.getCurrentTime());
        }
        if (!player.isMuted()){
            sound.setVolume(player.getVolume());
            player.mute();
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

function onReady(event){
    document.title = player.getVideoData().title;
}

function change(vid, sid){
    player.loadVideoById(vid);
    sound.loadVideoById(sid);
    document.querySelector('input[name=share]').value = window.location.origin + window.location.pathname + `?play&v=${vid}&s=${sid}&share`;
}

const container = document.querySelector('#char-container')
charList.forEach(ch=>{
    appendCharacter(ch);
})

// if (!query.isset('share')){
//     document.getElementById('recommanded').remove();
// }

function appendCharacter(character){
    const li = document.createElement('li');
    li.className = 'w-1/4 text-xl rounded m-2 px-2 py-4 cursor-pointer ';
    switch (character.vision){
        case 'Anemo':
            li.className += 'bg-green-200 hover:bg-green-300';
            break;
        case 'Geo':
            li.className += 'bg-amber-200 hover:bg-amber-300'; 
            break;
        case 'Hydro':
            li.className += 'bg-blue-200 hover:bg-blue-300';
            break;
        case 'Electro':
            li.className += 'bg-pink-200 hover:bg-pink-300';
            break;
        case 'Cryo':
            li.className += 'bg-sky-200 hover:bg-sky-300';
            break;
        case 'Pyro':
            li.className += 'bg-orange-200 hover:bg-orange-300';
            break;
        case 'Dendro':
            li.className += 'bg-lime-200 hover:bg-lime-300';
            break;
        default:
            li.className += 'bg-gray-200 hover:bg-gray-300';
            break;
    }
    li.onclick = () =>{
        if (player && sound){
            change(character.vid, character.sid);
        }else{
            createPlayer(character.vid, character.sid);
        }
    }
    li.innerText = character.name;
    container.append(li)
}