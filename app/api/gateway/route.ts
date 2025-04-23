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

    // リクエストボディの処理を改善
    let body;
    const contentType = headers.get("content-type")?.toLowerCase() || "";

    if (contentType.includes("application/json")) {
      // JSONの場合はテキストとして読み取ってからパースを試みる
      const text = await req.text();
      try {
        // 有効なJSONかチェック
        JSON.parse(text);
        body = text;
      } catch (e) {
        console.error("Invalid JSON in request:", e);
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } else {
      // JSON以外の場合はarrayBufferとして読み取る
      body = await req.arrayBuffer();
    }

    console.log("Forwarding POST request to:", FIXED_TARGET_URL);
    console.log("Headers:", Object.fromEntries(headers.entries()));

    const response = await fetch(FIXED_TARGET_URL, {
      method: "POST",
      headers,
      body,
    });

    console.log("Received response with status:", response.status);

    const responseHeaders = new Headers(response.headers);
    setCORSHeaders(responseHeaders);

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Proxy POST error:", err);

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

export async function OPTIONS(req: NextRequest) {
  const headers = new Headers();
  setCORSHeaders(headers);
  headers.set("Content-Length", "0");

  return new Response(null, {
    status: 204,
    headers,
  });
}
