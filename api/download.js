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
    const title = v.title || "audio"

    if (!audioUrl) return res.status(404).json({ error: "audio url not found" })

    const fetch = (await import("node-fetch")).default
    const upstream = await fetch(audioUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.youtube.com/"
      }
    })

    res.setHeader("Content-Type", upstream.headers.get("content-type") || "audio/mp4")
    res.setHeader("Content-Disposition", `attachment; filename="${title}.m4a"`)

    upstream.body.pipe(res)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
