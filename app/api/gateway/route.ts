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

    // レスポンスボディをクローンしてから読み取る
    const responseData = await response.clone().text();

    const responseHeaders = new Headers(response.headers);
    setCORSHeaders(responseHeaders);

    // Content-Typeが設定されていない場合、適切に設定
    if (!responseHeaders.has("content-type")) {
      responseHeaders.set("Content-Type", "application/json");
    }

    return new Response(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Proxy GET error:", err);

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

    // リクエストボディを取得
    const body = await req.text();

    // 実際のリクエストを送信
    const response = await fetch(FIXED_TARGET_URL, {
      method: "POST",
      headers,
      body,
    });

    // レスポンスデータをバイナリとして読み込む
    const responseData = await response.arrayBuffer();

    // 新しいヘッダーを作成
    const responseHeaders = new Headers();

    // 元のレスポンスヘッダーをコピー（Content-Encodingを除く）
    const headersEntries = Array.from(response.headers.entries());
    for (const [key, value] of headersEntries) {
      const lowerKey = key.toLowerCase();
      // 圧縮関連のヘッダーは転送しない
      if (
        lowerKey !== "content-encoding" &&
        lowerKey !== "content-length" &&
        lowerKey !== "transfer-encoding"
      ) {
        responseHeaders.set(key, value);
      }
    }

    // CORSヘッダーを設定
    setCORSHeaders(responseHeaders);

    // Content-Typeが設定されていることを確認
    if (!responseHeaders.has("content-type")) {
      responseHeaders.set("Content-Type", "application/json");
    }

    // バイナリデータでレスポンスを作成
    return new Response(responseData, {
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
