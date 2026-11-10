# StoryFrame Studio (ストーリーフレームスタジオ) 📸✨

Instagram（インスタグラム）のストーリーズ専用（9:16 / 1080×1920px）のオリジナル枠・フレーム付き画像ジェネレーターWebアプリです。

## 主な機能

- **9:16 ストーリーズ完全対応**:
  - Instagramストーリーズに最適な `1080 × 1920 px` の超高解像度PNGでワンクリック書き出し。
- **多彩なプリセットフレーム**:
  - 📷 **Polaroid**: クラシックなポラロイド・チェキ風フレーム（手書きフォントと日付メモ付き）
  - 🎞️ **35mm Film**: レトロなフィルムパーフォレーション穴＆FDSスタンプ
  - 🔲 **Minimal**: 洗練された細枠とドロップシャドウ
  - 📮 **Postage**: 切手風のステッチ・クラフトフレーム
  - 🖼️ **No Frame**: 写真のみを自由配置
- **写真の色調補正 & フィルム風フィルター**:
  - 🎞️ **ワンタップフィルター**: Cinema Moody, Teal & Orange, Risograph, FDS Warm, Fuji Chrome, Retro Fade, B&W Noir, Instant Cam
  - 🎛️ **詳細補正**: 露出、コントラスト、ハイライト、シャドウ、白レベル、黒レベル、彩度、色温度
  - ✨ **質感エフェクト**: フィルム粒子（グレイン）、周辺減光（ビネット）
  - 🔄 いつでもワンタップで色調を初期化可能
- **写真の直感操作**:
  - ドラッグ＆ドロップで写真を即時読み込み
  - プレビュー上で直接ドラッグして位置調整
  - スケール（拡大縮小・マウスホイール対応）・回転
  - 自動フィット / 全画面埋め
- **背景ぼかし（Blur Background）**:
  - 元写真を背景にぼかして敷き詰めるインスタ・TikTokトレンドの背景エフェクト
- **自作PNG枠の重ね合わせ**:
  - IllustratorやPhotoshopで作成した透過PNGフレームを重ねて合成可能
- **キャプション・日付入力**:
  - Google Fonts（Caveat, Cormorant Garamond, Inter, Share Tech Mono, Zen Old Mincho）対応
  - 「今日の日付」ワンタップ挿入ボタン

---

## 起動方法

### 1. ブラウザで直接開く
[`index.html`](./index.html) をダブルクリックするか、ターミナルから以下を実行するだけで起動します。

```bash
open ~/.gemini/antigravity/scratch/story-frame-studio/index.html
```

### 2. ローカルサーバーで開く場合（推奨）
```bash
cd ~/.gemini/antigravity/scratch/story-frame-studio
python3 -m http.server 3000
```
ブラウザで `http://localhost:3000` にアクセスしてください。

---

## ファイル構成
```
story-frame-studio/
├── index.html       # メインUI構成
├── style.css        # モダン＆グラスモーフィズムデザイン
├── app.js           # Canvasレンダリング & ドラッグ移動 & エクスポート処理
└── README.md        # プロジェクト概要・使い方
```
