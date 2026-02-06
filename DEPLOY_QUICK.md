# ⚡ 快速部署参考卡

## 🔗 重要链接

| 服务 | 链接 |
|------|------|
| GitHub 注册 | https://github.com/signup |
| Vercel 注册 | https://vercel.com/signup |
| Git 下载 | https://git-scm.com/downloads |
| 创建 GitHub Token | https://github.com/settings/tokens |

## 📝 命令速查

### 1. 推送代码到 GitHub

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/pet-match-game.git
git branch -M main
git push -u origin main
```

### 2. 更新游戏

```bash
git add .
git commit -m "更新游戏"
git push
```

## 🎯 部署流程

1. **GitHub 创建仓库** → `pet-match-game`
2. **推送代码** → 使用上面的命令
3. **Vercel 导入项目** → 自动部署
4. **获取链接** → 类似 `https://pet-match-game-xxx.vercel.app`

## ✅ 检查清单

- [ ] 注册 GitHub 账号
- [ ] 注册 Vercel 账号
- [ ] 在 GitHub 创建仓库
- [ ] 推送代码到 GitHub
- [ ] 在 Vercel 导入项目
- [ ] 部署成功
- [ ] 测试访问游戏链接

## 💡 提示

- GitHub Token 作为密码使用
- Vercel 自动检测 Next.js 配置
- 部署时间约 2-3 分钟
- 更新代码后自动重新部署
