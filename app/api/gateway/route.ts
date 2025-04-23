import { NextRequest } from "next/server";

const FIXED_TARGET_URL = "https://swp-server.ponz.workers.dev";

// 不要なヘッダーを除去して安全に転送する
function sanitizeHeaders(headers: Headers): Headers {
  const newHeaders = new Headers();
  for (const [key, value] of Array.from(headers.entries())) {
    const lowerKey = key.toLowerCase();
    if (
      ![
        "host",
        "connection",
        "content-length",
        "accept-encoding", // gzipなどの圧縮系はCloudflareがエラーにすることあり
      ].includes(lowerKey)
    ) {
      newHeaders.set(key, value);
    }
  }
  return newHeaders;
}

// CORSヘッダーを追加
function setCORSHeaders(headers: Headers) {
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
}

export async function GET(req: NextRequest) {
  try {
    const headers = sanitizeHeaders(req.headers);

    const response = await fetch(FIXED_TARGET_URL, {
      method: "GET",
      headers,
    });

    const responseHeaders = new Headers(response.headers);
    setCORSHeaders(responseHeaders);

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Proxy GET error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const headers = sanitizeHeaders(req.headers);
    const body = await req.arrayBuffer();

    const response = await fetch(FIXED_TARGET_URL, {
      method: "POST",
      headers,
      body,
    });

    const responseHeaders = new Headers(response.headers);
    setCORSHeaders(responseHeaders);

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Proxy POST error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export function OPTIONS() {
  const headers = new Headers();
  setCORSHeaders(headers);
  return new Response(null, {
    status: 204,
    headers,
  });
}
