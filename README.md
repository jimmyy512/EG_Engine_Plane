# EG Engine Plane

一個使用自製 JavaScript 遊戲引擎（EG Engine）開發的經典飛機射擊遊戲。

## 📖 專案介紹

EG Engine Plane 是一個基於 HTML5 Canvas 的 2D 飛機射擊遊戲，使用自製的輕量級遊戲引擎 EG Engine 開發。遊戲採用物件導向設計，包含完整的遊戲循環、精靈系統、動畫系統和碰撞檢測等功能。

## ✨ 功能特色

- 🎮 **流暢的遊戲體驗**：60 FPS 遊戲循環，流暢的動畫效果
- ✈️ **玩家飛機控制**：支援鍵盤方向鍵和 WASD 控制，支援斜向移動
- 🔫 **射擊系統**：空格鍵發射子彈，自動射擊間隔控制
- 👾 **敵機 AI**：自動生成敵機，智能移動和碰撞檢測
- 💥 **爆炸動畫**：敵機被擊毀時播放精美的爆炸動畫效果
- 🎨 **動畫系統**：支援精靈動畫，玩家飛機和敵機都有動畫效果
- 🗺️ **滾動背景**：無限滾動的背景地圖
- 🎯 **碰撞檢測**：精確的子彈與敵機碰撞檢測系統

## 🎮 操作說明

### 移動控制
- **方向鍵** 或 **WASD**：控制飛機移動
  - ⬆️ / W：向上移動
  - ⬇️ / S：向下移動
  - ⬅️ / A：向左移動
  - ➡️ / D：向右移動
  - 支援斜向移動（同時按下兩個方向鍵）

### 射擊
- **空格鍵**：發射子彈

## 🏗️ 技術架構

### 核心引擎（EG Engine）

- **Director（導演類）**：遊戲主循環管理，場景渲染
- **Sprite（精靈類）**：圖片精靈，支援動畫、縮放、旋轉、錨點設置
- **Label（標籤類）**：文字標籤顯示
- **Scheduler（調度器）**：事件和動畫調度系統
- **碰撞檢測**：基於矩形邊界的碰撞檢測

### 遊戲系統

- **子彈系統**：子彈生成、移動、碰撞檢測和移除
- **敵機 AI 系統**：敵機生成、移動、生命值管理和移除
- **爆炸動畫系統**：爆炸動畫的創建、播放和自動移除
- **背景滾動系統**：雙背景無縫滾動

## 📁 檔案結構

```
EG_Engine_Plane/
├── index.html          # 主 HTML 檔案
├── config.js           # 遊戲配置檔案（動畫間隔、移動速度等）
├── EG_Engine.js        # 遊戲引擎核心
├── EnemyAI.js          # 敵機 AI 系統
├── game.js             # 遊戲主邏輯
├── image/              # 遊戲資源目錄
│   ├── BG.png         # 背景圖片
│   ├── bullet.png     # 子彈圖片
│   ├── plane1-3.png   # 玩家飛機動畫幀
│   ├── Enemy1-3.png   # 敵機動畫幀
│   ├── explosion001-015.png  # 爆炸動畫幀
│   └── planeAssets/   # 額外飛機資源
└── README.md           # 專案說明文件
```

## 🚀 快速開始

### 本地運行

1. 克隆或下載專案
2. 使用本地伺服器運行（建議使用 VS Code Live Server 或 Python SimpleHTTPServer）
3. 打開 `index.html` 即可開始遊戲

### 使用 VS Code Live Server

```bash
# 安裝 Live Server 擴展
# 右鍵點擊 index.html -> Open with Live Server
```

### 使用 Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然後在瀏覽器中打開 `http://localhost:8000`

## 🎨 遊戲配置

在 `config.js` 中可以調整以下參數：

- `PLAYER_PLANE_ANIMATION_INTERVAL`：玩家飛機動畫間隔（毫秒）
- `ENEMY_PLANE_ANIMATION_INTERVAL`：敵機動畫間隔（毫秒）
- `EXPLOSION_ANIMATION_INTERVAL`：爆炸動畫間隔（毫秒）
- `_MapSpeed`：地圖滾動速度
- `const_KeyCheckRate`：按鍵檢測頻率（毫秒）

## 🌐 線上 Demo

[點擊這裡體驗線上版本](https://jimmyy512.github.io/EG_Engine_Plane/)

## 👨‍💻 開發者

Created By Majitoo

## 📝 技術特點

- **純 JavaScript**：無需任何框架或庫
- **Canvas 渲染**：使用 HTML5 Canvas 進行 2D 渲染
- **物件導向設計**：清晰的程式碼結構，易於擴展
- **模組化架構**：引擎、遊戲邏輯、AI 系統分離
- **高效能**：優化的遊戲循環和渲染系統

## 🔧 未來計劃

- [ ] 添加分數系統
- [ ] 添加生命值系統
- [ ] 添加關卡系統
- [ ] 添加音效和背景音樂
- [ ] 添加更多敵機類型
- [ ] 添加道具系統
- [ ] 添加暫停功能

## 📄 授權

本專案僅供學習和交流使用。

---

**享受遊戲！** 🎮✨
