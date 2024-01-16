# atArt

ユーザー同士が絵の見どころを座標指定して語り合えるサイト

## 前提

- Node.js v20
- Bun v1
- Doppler CLI v3
- Firebase CLI v13
- Vercel CLI v33

## 環境構築

```bash
gh repo clone ShinKamakura/at-art
bun install
doppler setup
```

## 実行

[http://localhost:3000](http://localhost:3000)

##### テストサーバー

```bash
doppler run -- bun --bun dev --turbo
```

##### 本番サーバー

```bash
doppler run -- bun run build
bun start
```
