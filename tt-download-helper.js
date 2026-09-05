const http = require("http");
const PORT = process.env.PORT || 8787;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  const u = new URL(req.url, "http://x");
  if (u.pathname !== "/dl") { res.writeHead(404); return res.end(); }
  const t = (u.searchParams.get("url") || "").trim();
  if (!/^https?:\/\//i.test(t)) { res.writeHead(400); return res.end("url required"); }
  try {
    const r = await fetch(t, { headers: { "User-Agent": UA, "Referer": "https://www.tiktok.com/", "Accept": "video/mp4,video/*,*/*" }, redirect: "follow" });
    if (!r.ok) { res.writeHead(r.status); return res.end("upstream " + r.status); }
    res.writeHead(200, { "Content-Type": r.headers.get("content-type") || "video/mp4", "Cache-Control": "no-store" });
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch (e) { res.writeHead(502); res.end("err"); }
}).listen(PORT, () => console.log("tt-helper on :" + PORT));
