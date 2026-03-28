const ytDlp = require("yt-dlp-exec")

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  const { q } = req.query
  if (!q) return res.status(400).json({ error: "query required" })

  try {
    const result = await ytDlp(`ytsearch1:${q}`, {
      dumpSingleJson: true,
      noPlaylist: true,
      quiet: true,
      noWarnings: true
    })

    const v = result.entries?.[0] || result

    res.json({
      id: v.id,
      title: v.title,
      uploader: v.uploader || v.channel,
      duration: v.duration,
      thumbnail: v.thumbnail,
      views: v.view_count,
      uploadDate: v.upload_date,
      url: `https://www.youtube.com/watch?v=${v.id}`
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
