let currentSong = new Audio();
let songs;

// get the list of all songs

async function getSongs(folderPath) {
    // let a = await fetch(folderPath)

    const apiUrl = 'https://pantherp19.github.io/Spotify/songs/';
    const accessToken = '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';

    let a = await fetch(apiUrl, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(userData => {
    console.log('GitHub User Data:', userData);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });




    
    let responce = await a.text();
    let div = document.createElement('div')
    div.innerHTML = responce
    let as = div.getElementsByTagName('a')
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href)
        }
    }
    return songs;
}

// get folder list

async function getFolders() {
    let a = await fetch('/songs/')
    console.log(a, 'this is getFolders function')
    let responce = await a.text();
    let div = document.createElement('div')
    div.innerHTML = responce
    let as = div.getElementsByTagName('a')
    let folders = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.includes('/songs/') && !element.href.endsWith('.mp3')) {
            folders.push(element.href)
        }
    }
    return folders;
}



// main function of operations

async function main() {

    // get folders from song directory

    let folders = await getFolders();

    folders.forEach(async folder => {
        const folderName = folder.split('/songs/')[1]
        const imgPath = folder + '/poster.jpeg'
        let jsonurl = folder + '/type.json'
        let jsondata = await fetch(jsonurl).then(response => response.json()).then(data => {
            // Use the parsed JSON data
            let cardContainer = document.querySelector('.cardsContainer')
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card" onclick="getFolder('${folder}')">
            <div class="play">
                <i class="fa-solid fa-play"></i>
            </div>
            <img src=${imgPath} alt="">
            <h2>${data.title}</h2>
            <p>${data.disc}</p>
        </div>`
        })

    });

    const arr = document.querySelector(".songList").getElementsByTagName('li');
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.hasAttribute('id')) {
            element.addEventListener('click', e => {
                playSong(element.innerHTML)
            })
        }
    }
    // attach eventListener to play button

    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.classList.replace("fa-play", "fa-pause");
        }
        else {
            currentSong.pause()
            play.classList.replace("fa-pause", "fa-play");
        }
    })

    // attach eventListener to previus and next button

    previus.addEventListener('click', () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src)
        if (index > 0) {
            let previusSong = songs[index - 1].split('/songs/')[1].replaceAll('%20', ' ')
            playSong(previusSong)
        }
        else {
            currentSong.play()
        }
    })

    next.addEventListener('click', () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src)
        if (index + 1 < songs.length) {
            let nextSong = songs[index + 1].split('/songs/')[1].replaceAll('%20', ' ')
            playSong(nextSong)
        }
        else {
            currentSong.play()
        }
    })

    // addEventListener to volume

    volume.addEventListener('change', (e) => {
        currentSong.volume = e.target.value / 100
    })
}
main();

// onclick fuction for card

// async function getFolder(folder) {
//     const folderPath = folder + "/"
//     circle.value = 0;

//     // Get songs from folder

//     songs = await getSongs(folderPath);
//     currentSong.src = songs[0]
//     playSong(songs[0].split(`/songs/`)[1].replaceAll('%20', ' '), true)

//     let songUL = document.querySelector('.songList>div')
//     songUL.innerHTML = ''

//     for await (const song of songs) {
//         console.log(song, 'this is song log')
//         // let songN = song.replaceAll('%20', ' ').split('songs/')[1].split('//')[1]
//         let songN = song.replaceAll('%20', ' ').split('songs/')[1].split('/')[1]
//         songUL.innerHTML = songUL.innerHTML + `<div class="libraryList flex">
//         <i class="fa-solid fa-radio radio"></i>
//         <div class="songDetails">
//             <ul> <li class="songName" id='songName'>${songN}</li> <li class="singerName">Pravin</li> </ul>
//         </div>
//         <i class="fa-solid fa-play " onclick="playSong('${song.replaceAll('%20', ' ').split('/songs/')[1]}')"></i>
//     </div>`
//     }
// }

// attach timeupdate event

currentSong.addEventListener('timeupdate', () => {
    const currentTm = secondsToMinutes(currentSong.currentTime)
    const currentDur = secondsToMinutes(currentSong.duration)
    document.querySelector('.songDuration').innerHTML = `${currentTm} / ${currentDur}`;
    let a = (currentSong.currentTime / 'currentSong.duration') * 100
    circle.value = (currentSong.currentTime / currentSong.duration) * 100;
})


// play the songs

function playSong(song, pause = false) {
    currentSong.src = '/songs/' + song
    if (pause == false) {
        currentSong.play();
        play.classList.replace("fa-play", "fa-pause");
    }
    document.querySelector('.songinfo').innerHTML = song.split('//')[1];
}




// attach event listener to seekbar

circle.addEventListener('click', (e) => {
    const percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
    circle.value = percent
    currentSong.currentTime = (currentSong.duration * percent) / 100
})

// attach event Listener to menubar

document.querySelector('.menuBar').addEventListener('click', () => {
    document.querySelector('.left').style.left = 0;
})

document.querySelector('.menuClose').addEventListener('click', () => {
    document.querySelector('.left').style.left = -70 + '%'
})

// formate the TimeRanges

function secondsToMinutes(seconds) {
    // Ensure the input is a valid number
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(remainingSeconds).padStart(2, '0');

    return `${minutesString}:${secondsString}`;
}
