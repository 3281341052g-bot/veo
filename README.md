# Veo - AI 视频生成平台

基于 Google Vertex AI Veo 3 构建的全栈 AI 视频生成平台，支持文本生成视频和图片生成视频。

## 功能特性

- 🎬 **文本生成视频**：输入自然语言描述，AI 自动生成高质量视频
- 🖼️ **图片生成视频**：上传静态图片，让 AI 为其注入动感
- 🎵 **智能音频**：自动生成与视频匹配的背景音效
- ⚡ **多种规格**：支持 720p/1080p 分辨率，16:9/9:16 比例，5/8 秒时长
- 🗂️ **作品集**：本地保存历史记录，随时查看已生成视频

## 技术栈

- **前端**：Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **后端**：Next.js API Routes
- **AI 能力**：Google Vertex AI Veo 3
- **认证**：google-auth-library

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Vertex AI

#### 2.1 创建 Google Cloud 项目

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 创建或选择一个项目
3. 开启 Vertex AI API

#### 2.2 创建服务账号

1. 进入「IAM 与管理」>「服务账号」
2. 创建服务账号，授予「Vertex AI 用户」角色
3. 生成并下载 JSON 密钥文件

#### 2.3 申请 Veo 模型访问权限

Veo 3 目前处于预览阶段，需要申请访问权限：
- 访问 [Vertex AI Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)
- 找到 Veo 3 并申请访问

### 3. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
VEO_MODEL_ID=veo-3.0-generate-preview
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud 项目 ID | `my-project-123` |
| `GOOGLE_CLOUD_LOCATION` | Vertex AI 区域 | `us-central1` |
| `GOOGLE_APPLICATION_CREDENTIALS` | 服务账号密钥路径 | `/path/to/key.json` |
| `VEO_MODEL_ID` | Veo 模型版本 | `veo-3.0-generate-preview` |

## 使用指南

### 文本生成视频

1. 点击导航栏「创作」进入生成页面
2. 确保选中「文本生成视频」标签
3. 在提示词框中输入详细的视频描述
4. 调整参数（比例、时长、分辨率、音频）
5. 点击「开始生成」，等待约 2-5 分钟
6. 生成完成后预览并下载视频

### 图片生成视频

1. 切换至「图片生成视频」标签
2. 拖拽或点击上传参考图片
3. 可选填写描述动作的提示词
4. 设置参数后点击「开始生成」

## 项目结构

```
veo/
├── app/
│   ├── api/
│   │   ├── generate-video/   # 视频生成 API
│   │   ├── check-status/     # 状态查询 API
│   │   └── upload-image/     # 图片上传 API
│   ├── generate/             # 生成页面
│   ├── gallery/              # 作品集页面
│   ├── layout.tsx
│   ├── page.tsx              # 首页
│   └── globals.css
├── components/               # UI 组件
├── lib/
│   ├── vertexai.ts           # Vertex AI 封装
│   └── types.ts              # 类型定义
└── .env.local.example
```

## 许可证

MIT