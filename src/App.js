import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./App.scss";

function App() {
  const [tracks, setTracks] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(0);

  useEffect(() => {
    fetch("/musicList.txt")
      .then((r) => r.text())
      .then((t) => setTracks(t.split("\n").map((i) => `music/${i}`)));
  }, []);

  useEffect(() => {
    console.log(currentTrack);
  }, [currentTrack]);

  return (
    <div className="App">
      <h1 className="title">
        {tracks && tracks[currentTrack].split("music/")[1].split(".mp3")[0]}
      </h1>
      <AudioPlayer
        className="player"
        autoPlayAfterSrcChange
        showSkipControls
        src={tracks && tracks[currentTrack]}
        onEnded={() => setCurrentTrack((currentTrack + 1) % tracks.length)}
        onClickNext={() => setCurrentTrack((currentTrack + 1) % tracks.length)}
        onClickPrevious={() =>
          setCurrentTrack(
            (((currentTrack - 1) % tracks.length) + tracks.length) %
              tracks.length
          )
        }
      />
      {tracks &&
        tracks.map((track, i) => {
          return (
            <p
              className="listing"
              key={i}
              onClick={() => setCurrentTrack(i)}
              style={
                currentTrack === i ? { color: "#DA0037" } : { color: "white" }
              }
            >
              {track.split("music/")[1].split(".mp3")[0]}
            </p>
          );
        })}
    </div>
  );
}

export default App;
