import { NextRequest } from "next/server";

const FIXED_TARGET_URL = "https://swp-server.ponz.workers.dev";

// 不要なヘッダーを除去して安全に転送する
function sanitizeHeaders(headers: Headers): Headers {
  const newHeaders = new Headers();
  for (const [key, value] of Array.from(headers.entries())) {
    const lowerKey = key.toLowerCase();
    if (
      !["host", "connection", "content-length", "accept-encoding"].includes(
        lowerKey
      )
    ) {
      newHeaders.set(key, value);
    }
  }

  // Content-Typeが設定されていない場合のデフォルト値を設定
  if (!newHeaders.has("content-type")) {
    newHeaders.set("Content-Type", "application/json");
  }

  return newHeaders;
}

// CORSヘッダーを追加
function setCORSHeaders(headers: Headers) {
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "*");
}

export async function GET(req: NextRequest) {
  try {
    const headers = sanitizeHeaders(req.headers);

    // URLのクエリパラメータを保持
    const url = new URL(FIXED_TARGET_URL);
    const searchParams = new URL(req.url).searchParams;
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
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

    // 型ガードを使用してエラーを絞り込む
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: errorMessage }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const headers = sanitizeHeaders(req.headers);

    // リクエストボディをそのまま転送
    const body = await req.text();

    const response = await fetch(FIXED_TARGET_URL, {
      method: "POST",
      headers,
      body,
    });

    // すべてのレスポンスヘッダーを保持
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // CORSヘッダーを追加（既存のヘッダーを上書きしない）
    if (!responseHeaders.has("Access-Control-Allow-Origin")) {
      responseHeaders.set("Access-Control-Allow-Origin", "*");
    }
    if (!responseHeaders.has("Access-Control-Allow-Methods")) {
      responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    }
    if (!responseHeaders.has("Access-Control-Allow-Headers")) {
      responseHeaders.set("Access-Control-Allow-Headers", "*");
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Proxy POST error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const headers = new Headers();
  setCORSHeaders(headers);
  headers.set("Content-Length", "0");

  return new Response(null, {
    status: 204,
    headers,
  });
}
