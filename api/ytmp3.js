const ytdl = require("ytdl-core");
const fs = require("fs");
const express = require("express");
const yts = require("yt-search");
const router = express.Router();

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

router.get("/:id", async function(req, res) {
  const response = {
    title: "",
    id: "",
    url: "",
    link: "",
    thumbnail: "",
    duration: "",
    status: "",
    err: ""
  }

  const random = makeid(9);
  const id = req.params.id;

  const videos = await yts(id);
  const video = videos.videos[0];

  if (!video) {
    response.status = "fail";
  } else if (video) {
    response.title = video.title
    response.id = video.videoId
    response.url = video.url
    response.thumbnail = video.thumbnail
    response.duration = video.timestamp

    try {
      const stream = ytdl(response.url, {
        quality: "highestaudio",
        format: "mp3",
        filter: "audioonly"
      })
      fs.mkdirSync(`mp3/${random}`);
      stream.pipe(fs.createWriteStream(`mp3/${random}/${response.title}.mp3`))
      response.link = `mp3/${random}/${response.title}.mp3`
      response.status = "ok"
    } catch (err) {
      response.err = err
      response.status = "fail"
    }
  }

   res.json(response)
})

module.exports = router;
