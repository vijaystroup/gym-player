// to use: node dumpTracks

const fs = require("fs");

const files = fs.readdirSync("public/music");
console.log(files);

fs.writeFile("public/musicList.txt", files.join("\n"), (err) => {
  if (err) {
    console.log(err);
  }
});
