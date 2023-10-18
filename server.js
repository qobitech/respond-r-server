const express = require("express")
// const Stream = require("node-rtsp-stream")
const ffmpeg = require("fluent-ffmpeg")
const cors = require("cors")

const app = express()
const port = 3002
let stream = null

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
)

app.get("/stream", (req, res) => {
  const newRtspStreamUrl = req.query.rtsp
  // let currentRtspStreamUrl = ""

  // // Create the WebSocket stream only if it doesn't exist or the RTSP URL has changed
  // if (!stream || currentRtspStreamUrl !== newRtspStreamUrl) {
  //   if (stream || newRtspStreamUrl === "stop") {
  //     stream.stop()
  //   }
  //   stream = new Stream({
  //     name: "Camera Stream",
  //     streamUrl: newRtspStreamUrl,
  //     wsPort: 9999,
  //   })
  //   currentRtspStreamUrl = newRtspStreamUrl
  // }

  // res.sendStatus(200).json({ url: `ws://localhost:9999` })
  const ffmpegCommand = ffmpeg(newRtspStreamUrl)
    .inputFormat("rtsp")
    .inputOptions("-rtsp_transport", "tcp")
    .videoCodec("copy")
    .audioCodec("aac")
    // .outputOptions([
    //   "-hls_time 10", // Set segment duration
    //   "-hls_list_size 6", // Set playlist size
    // ])
    // .output(`${hlsOutputDir}/output.m3u8`)
    .on("end", () => {
      console.log("Conversion finished.")
    })
    .on("error", (err) => {
      console.error("Error:", err)
    })
    .writeToStream(res, function (retcode, error) {
      console.log("file has been converted succesfully")
    })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
