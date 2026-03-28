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
      noWarnings: true,
      format: "bestaudio[ext=m4a]/bestaudio"
    })

    const v = result.entries?.[0] || result
    const audioUrl = v.url || v.formats?.find(f => f.url)?.url

    if (!audioUrl) return res.status(404).json({ error: "audio url not found" })

    res.redirect(audioUrl)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
