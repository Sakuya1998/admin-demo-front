# Admin Demo Web 前端项目说明

## 项目简介

本项目是 `admin-demo` 的前端管理系统，基于 Vue 3 + TypeScript + Vite 构建，提供后台常见管理能力，包括：

- 登录鉴权与用户信息
- 用户、角色、菜单、权限、字典、系统配置管理
- 审计日志（登录日志、操作日志、在线用户）
- 通知中心与通知模板
- 文件管理与定时任务管理
- 中英文国际化切换

## 技术栈

- Vue 3
- TypeScript
- Vite 6
- Pinia
- Vue Router 4
- Ant Design Vue 4
- Axios
- Vue I18n
- Less
- Vitest + Vue Test Utils
- ESLint + Prettier + Husky + lint-staged

## 环境要求

- Node.js 20 及以上（建议使用 LTS）
- pnpm（推荐）

## 快速开始

```bash
# 1) 进入前端目录
cd web

# 2) 安装依赖
pnpm install

# 3) 启动开发服务
pnpm dev
```

默认开发地址：`http://localhost:5173`

## 环境变量

项目内置以下环境变量文件：

- `.env.development`
- `.env.production`

当前使用的核心变量：

- `VITE_API_BASE_URL`：接口基础路径（默认 `/api`）
- `VITE_APP_ENV`：当前环境标识（development / production）
- `VITE_USE_MOCK`：是否启用本地 Mock（development 下生效）

## 常用命令

```bash
pnpm dev      # 启动开发环境
pnpm build    # 生产构建（包含 vue-tsc 类型检查）
pnpm preview  # 本地预览构建结果
pnpm test     # 运行单元测试
pnpm lint     # ESLint 检查并自动修复
pnpm format   # 使用 Prettier 格式化 src 目录
```

## 目录结构

```text
web
├─ public/                 # 静态资源
├─ src/
│  ├─ api/                 # 接口请求模块
│  ├─ assets/              # 样式与资源
│  ├─ components/          # 通用组件
│  ├─ composables/         # 组合式函数
│  ├─ directives/          # 自定义指令
│  ├─ layouts/             # 布局组件
│  ├─ locales/             # 国际化语言包
│  ├─ router/              # 路由与导航守卫
│  ├─ stores/              # Pinia 状态管理
│  ├─ utils/               # 工具方法（含 request 封装）
│  ├─ views/               # 页面视图
│  ├─ App.vue
│  └─ main.ts              # 入口文件
├─ mock/                   # 本地 Mock 接口
├─ index.html
├─ vite.config.ts
├─ nginx.conf
└─ Dockerfile
```

## 接口与代理说明

- 前端请求通过 `src/utils/request.ts` 统一封装
- 开发环境在 `vite.config.ts` 中将 `/api` 代理到 `http://localhost:8080`
- 生产环境（容器）通过 `nginx.conf` 将 `/api` 反向代理到后端服务 `app:8080`

## 本地 Mock 开发

- 默认开发环境启用本地 Mock（`VITE_USE_MOCK=true`）
- Mock 数据定义在 `mock/index.ts`
- 当需要联调真实后端时，将 `.env.development` 里的 `VITE_USE_MOCK` 改为 `false`，然后重启 `pnpm dev`

## Docker 构建说明

项目提供多阶段构建：

1. 使用 Node 镜像安装依赖并执行 `pnpm build`
2. 使用 Nginx 镜像托管 `dist` 静态文件
3. 通过 `nginx.conf` 处理静态缓存、API 代理与前端路由回退

## 开发说明

- 入口文件：`src/main.ts`
- 路由定义：`src/router/index.ts`
- 路由守卫：`src/router/guard.ts`
- 动态菜单转路由：`src/stores/permission.ts`
- 国际化文本：`src/locales/`

需与后端接口对接，可参考仓库根目录的 `docs/API_FRONTEND_GUIDE.md`。

## 其他
使用中文交流
