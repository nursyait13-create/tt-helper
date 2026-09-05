const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  const u = new URL(req.url, "http://x");
  const t = (u.searchParams.get("url") || "").trim();
  if (!/^https?:\/\//i.test(t)) { res.status(400).end("url required"); return; }
  try {
    const r = await fetch(t, { headers: { "User-Agent": UA, "Referer": "https://www.tiktok.com/", "Accept": "video/mp4,video/*,*/*" }, redirect: "follow" });
    if (!r.ok) { res.status(r.status).end("upstream " + r.status); return; }
    res.setHeader("Content-Type", r.headers.get("content-type") || "video/mp4");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(Buffer.from(await r.arrayBuffer()));
  } catch (e) { res.status(502).end("err"); }
};
