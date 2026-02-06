# 🎮 萌宠消消乐 - Vercel 部署指南

## 📋 部署前准备

### 1. 注册账号
- **GitHub**: https://github.com/signup （免费）
- **Vercel**: https://vercel.com/signup （免费）

### 2. 安装 Git（如果还没有）
- 下载地址：https://git-scm.com/downloads
- 安装时保持默认选项即可

---

## 🚀 部署步骤（20分钟完成）

### 第一步：上传代码到 GitHub（10分钟）

#### 1.1 在 GitHub 创建仓库

1. 登录 GitHub
2. 点击右上角 **"+"** → **"New repository"**
3. 填写信息：
   - **Repository name**: `pet-match-game`
   - **Description**: `萌宠消消乐 - 三消游戏`
   - **Public/Private**: 选择 **Public**（免费）
   - 勾选 **"Initialize this repository with a README"** ❌（不要勾选）
4. 点击 **"Create repository"**

#### 1.2 推送代码到 GitHub

**在沙箱环境中执行以下命令**：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/pet-match-game.git

# 推送代码
git branch -M main
git push -u origin main
```

**如果需要认证，GitHub 会提示你输入 Personal Access Token**：
- 创建 Token：https://github.com/settings/tokens → "Generate new token"
- 勾选 `repo` 权限
- 生成后复制 Token
- 使用 Token 作为密码

---

### 第二步：在 Vercel 部署（5分钟）

#### 2.1 导入项目到 Vercel

1. 登录 Vercel: https://vercel.com
2. 点击 **"Add New..."** → **"Project"**
3. 点击 **"Import Git Repository"**
4. 找到并选择你的 `pet-match-game` 仓库
5. 点击 **"Import"**

#### 2.2 配置项目

Vercel 会自动检测到 Next.js 项目，配置如下：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Framework Preset** | Next.js | 自动检测 |
| **Root Directory** | `./` | 保持默认 |
| **Build Command** | `pnpm run build` | 自动填充 |
| **Output Directory** | `.next` | 自动填充 |
| **Install Command** | `pnpm install` | 自动填充 |

#### 2.3 开始部署

1. 点击 **"Deploy"** 按钮
2. 等待 2-3 分钟，Vercel 会自动：
   - 安装依赖
   - 构建项目
   - 部署到全球 CDN

#### 2.4 获取访问链接

部署成功后，Vercel 会显示：
- **部署链接**：类似 `https://pet-match-game-xxx.vercel.app`
- 点击链接即可访问游戏！

---

### 第三步：自定义域名（可选，2分钟）

如果想要自己的域名：

1. 在 Vercel 项目页面，点击 **"Settings"** → **"Domains"**
2. 添加你的域名
3. 按照提示配置 DNS

---

## ✅ 部署成功验证

部署完成后，访问你的游戏链接，应该能看到：
- 🐕 萌宠消消乐的标题
- 🎮 关卡选择界面
- 🎨 渐变背景的精美界面

---

## 🔄 如何更新游戏

修改代码后，只需：

```bash
# 在沙箱环境中
git add .
git commit -m "更新游戏功能"
git push
```

Vercel 会自动检测更新并重新部署！

---

## 💡 常见问题

### Q1: 部署失败怎么办？
**A**: 检查构建日志，通常是：
- 依赖安装失败 → 等待一会儿重试
- 构建错误 → 检查代码是否有语法错误

### Q2: 如何查看部署日志？
**A**: 在 Vercel 项目页面，点击 **"Deployments"** → 点击最新的部署 → 查看 "Build Logs"

### Q3: 免费额度够用吗？
**A**: Vercel 免费版足够个人项目使用：
- 100GB 带宽/月
- 无限次部署
- 自动 HTTPS

---

## 📞 需要帮助？

如果遇到问题，可以：
- 查看 Vercel 官方文档：https://vercel.com/docs
- 或告诉我具体错误，我帮你解决

---

## 🎉 享受你的游戏！

部署成功后，分享链接给朋友，大家一起玩萌宠消消乐！
