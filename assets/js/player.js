document.addEventListener("DOMContentLoaded", function (event) {
    // Vars
    const wrapper = document.querySelector('.wrapper');
    // const musicImage = wrapper.querySelector('.img-area img');
    const title = wrapper.querySelector('.song-details .name');
    // const artist = wrapper.querySelector('.song-details .artist');
    const songs = wrapper.querySelectorAll('.music-list .song-list .song');
    const songsUnordedList = wrapper.querySelector('.song-list');
    const playbtn = wrapper.querySelector('.controls #play');
    const prevbtn = wrapper.querySelector('.controls #skip-prev');
    const nextbtn = wrapper.querySelector('.controls #skip-next');
    const progressBar = wrapper.querySelector('.progress-area .progress-bar');
    const progressArea = wrapper.querySelector('.progress-area');
    const songDurationField = wrapper.querySelector('.progress-area .timer .duration');
    const songCurrentField = wrapper.querySelector('.progress-area .timer .current');
    const songSelection = wrapper.querySelector('#open');
    const songSelectionCloser = songSelection.querySelector('#close');


    let audio = null;
    let musicIndex = 0;

    window.addEventListener('load', () => {
        // Just load the title selection
        wrapper.classList.add('paused');
        loadMusic(musicIndex, 'load');
    });

    // Load player on page load
    function loadMusic(musicIndex, event) {
        console.log('Grabbing index: ', musicIndex);
        console.log('event: ', event);
        switch (event) {
            case 'paused':
                audio.play();
                playbtn.setAttribute('name', 'pause-outline');
                wrapper.classList.remove('paused');
                break;
            case 'replay':
                // TODO: zzz
                break;

            default:
                if (songs) {
                    let songChoice = songs[musicIndex];
                    if (songChoice) {
                        console.log('Grabbing song: ', songChoice);
                        let songName = songChoice.querySelector('.row span').innerHTML;
                        if (songName) {
                            console.log('Grabbing song name: ', songName);
                            title.innerHTML = songName;
                            audio = new Audio(`/music/${songName}.mp3`);
                            console.log(audio);
                            // Do not trigger a play if load event
                            if (event !== 'load') {
                                wrapper.classList.remove('paused');
                                audio.play();
                                playbtn.setAttribute('name', 'pause-outline');
                            }
                            // Load duration data
                            audio.addEventListener('loadeddata', () => {
                                let dur = audio.duration;
                                let totalMin = Math.floor(dur / 60);
                                let totalSec = Math.floor(dur % 60);
                                // append 0
                                if (totalSec < 10)
                                    totalSec = `0${totalSec}`;
                                songDurationField.innerText = `${totalMin}:${totalSec}`;
                            });
                            // Get time update to update prog bar and current time
                            audio.addEventListener('timeupdate', (e) => {
                                const currentTime = e.target.currentTime;
                                const duration = e.target.duration;

                                let progWidth = (currentTime / duration) * 100;
                                progressBar.style.width = `${progWidth}%`;

                                let totalMin = Math.floor(currentTime / 60);
                                let totalSec = Math.floor(currentTime % 60);
                                // append 0
                                if (totalSec < 10)
                                    totalSec = `0${totalSec}`;

                                songCurrentField.innerText = `${totalMin}:${totalSec}`;
                            });
                            // go next on song end
                            audio.addEventListener('ended', () => {
                                console.log('Song ended');
                                stopMusic();
                                if (musicIndex > songs.length - 1) {
                                    // Loop back
                                    musicIndex = 0;
                                    loadMusic(musicIndex, true);
                                    return;
                                }

                                musicIndex++
                                loadMusic(musicIndex, true);
                            });
                        }
                    }
                }
                break;
        }
    }

    function pauseMusic() {
        if (audio === null)
            return;

        wrapper.classList.add('paused');
        audio.pause();
        playbtn.setAttribute('name', 'play-outline');
    }

    function stopMusic() {
        if (audio === null)
            return;

        audio.pause()
        audio.currentTime = 0;
    }

    // WHY DOESNT THIS WORK TODO WHEN I WAKE
    songSelection.addEventListener('click', () => {
        console.log('Open song selector');
        const viewer = wrapper.querySelector('.music-list');
        const isShowing = viewer.classList.toggle('show-list');
        console.log(isShowing);
    });


    // Load song on list click.
    songs.forEach(s => {
        s.addEventListener('click', (e) => {
            let children = [...songsUnordedList.children];
            // console.log(children);
            for (let i = 0; i < children.length; i++) {
                let match = children[i].children[0].outerText;
                let target = e.target.outerText.trim();
                // console.log(match);
                // console.log(target);
                if (target === match) {
                    // Remove selected from anything prev selected
                    wrapper.querySelectorAll('.selected')
                    .forEach(s => s.classList.remove('selected'));
                    
                    // Add class selected to target element
                    e.target.classList.add('selected');
                    stopMusic();
                    console.log(i);
                    loadMusic(i, 'play');
                    break;
                }
            }
        });
    })


    // Add a click event listener on the play icon
    playbtn.addEventListener('click', () => {
        const isPaused = wrapper.classList.contains('paused');
        console.log('Currently paused: ', isPaused);
        if (isPaused) {
            loadMusic(musicIndex, 'paused');
        } else if (!isPaused) {
            pauseMusic();
        } else {
            loadMusic(musicIndex, 'play');
        }
    });

    prevbtn.addEventListener('click', () => {
        stopMusic();
        if (musicIndex == 0) {
            musicIndex = songs.length - 1;
            loadMusic(musicIndex, true);
            return;
        }

        musicIndex--
        loadMusic(musicIndex, 'play');
    });

    nextbtn.addEventListener('click', () => {
        stopMusic();
        if (musicIndex > songs.length - 1) {
            // Loop back
            musicIndex = 0;
            loadMusic(musicIndex, 'play');
            return;
        }

        musicIndex++
        loadMusic(musicIndex, 'play');
    });


    progressArea.addEventListener('click', (e) => {
        let progWidthVal = progressArea.clientWidth;
        let clickedOffSetX = e.offsetX;
        let songDuration = audio.duration;

        audio.currentTime = (clickedOffSetX / progWidthVal) * songDuration;
    });

});