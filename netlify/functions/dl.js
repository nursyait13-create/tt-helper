const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
exports.handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  const u = new URL(event.rawUrl || event.path, "http://x");
  const t = (u.searchParams.get("url") || "").trim();
  if (!/^https?:\/\//i.test(t)) return { statusCode: 400, headers, body: "url required" };
  try {
    const r = await fetch(t, { headers: { "User-Agent": UA, "Referer": "https://www.tiktok.com/", "Accept": "video/mp4,video/*,*/*" }, redirect: "follow" });
    if (!r.ok) return { statusCode: r.status, headers, body: "upstream " + r.status };
    const buf = Buffer.from(await r.arrayBuffer());
    return { statusCode: 200, headers: { ...headers, "Content-Type": r.headers.get("content-type") || "video/mp4", "Cache-Control": "no-store" }, body: buf.toString("base64"), isBase64Encoded: true };
  } catch (e) { return { statusCode: 502, headers, body: "err" }; }
};
