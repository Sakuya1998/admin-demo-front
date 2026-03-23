# Admin Demo 前端对接文档

## 目录

1. [概述](#概述)
2. [通用约定](#通用约定)
3. [认证模块](#认证模块)
4. [个人信息](#个人信息)
5. [用户管理](#用户管理)
6. [角色管理](#角色管理)
7. [用户组管理](#用户组管理)
8. [菜单管理](#菜单管理)
9. [权限管理](#权限管理)
10. [字典管理](#字典管理)
11. [系统配置](#系统配置)
12. [文件管理](#文件管理)
13. [通知管理](#通知管理)
14. [定时任务](#定时任务)
15. [审计模块](#审计模块)
16. [健康检查](#健康检查)

---

## 概述

### 基础信息

| 项目 | 说明 |
|------|------|
| Base URL | `http://localhost:8080/api/v1` |
| 协议 | HTTP/HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |

### Swagger 文档

开发环境下可访问在线 API 文档：
- Swagger UI: `http://localhost:8080/swagger/index.html`

---

## 通用约定

### 请求头

| Header | 说明 | 示例 |
|--------|------|------|
| `Content-Type` | 请求体格式 | `application/json` |
| `Authorization` | 认证令牌 | `Bearer eyJhbGciOiJIUzI1NiIs...` |
| `X-Request-ID` | 请求追踪ID（可选） | `uuid-string` |
| `Accept-Version` | API版本（可选） | `v1` |

### 统一响应格式

所有接口返回统一的 JSON 结构：

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | number | 业务状态码，0 表示成功 |
| `msg` | string | 业务消息 |
| `data` | object/array/null | 响应数据 |

### 业务状态码

| Code | 说明 |
|------|------|
| 0 | 成功 |
| 1 | 通用错误 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### 分页响应格式

分页接口返回以下结构：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "page_size": 10,
    "total_pages": 10
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `items` | array | 数据列表 |
| `total` | number | 总条数 |
| `page` | number | 当前页码 |
| `page_size` | number | 每页数量 |
| `total_pages` | number | 总页数 |

### 分页请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `page` | number | 否 | 1 | 页码，最小为 1 |
| `page_size` | number | 否 | 10 | 每页数量，最大 100 |

---

## 认证模块

### 1. 用户登录

**POST** `/auth/login`

> 公开接口，无需认证。有登录频率限制。

**请求体：**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名，3-50 字符 |
| `password` | string | 是 | 密码，1-128 字符 |

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "email": "admin@example.com",
      "phone": "13800138000",
      "avatar": "/uploads/avatar/1.png",
      "status": 1,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2. 刷新令牌

**POST** `/auth/refresh`

> 公开接口，无需认证。

**请求体：**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. 用户登出

**POST** `/auth/logout`

> 需要认证

**响应示例：**

```json
{
  "code": 0,
  "msg": "success"
}
```

### Token 使用说明

1. 登录成功后获取 `access_token` 和 `refresh_token`
2. 后续请求在 Header 中携带：`Authorization: Bearer {access_token}`
3. `access_token` 过期后，使用 `refresh_token` 获取新令牌
4. `refresh_token` 也过期后，需要重新登录

---

## 个人信息

> 需要认证，不需要权限检查，只能操作当前登录用户自己的信息

### 1. 获取当前用户信息

**GET** `/profile/me`

> 通过 Token 获取当前登录用户的详细信息（含角色和组）

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "avatar": "/uploads/avatar/1.png",
    "status": 1,
    "roles": [
      {"id": 1, "name": "admin", "desc": "超级管理员", "status": 1}
    ],
    "groups": [
      {"id": 1, "name": "开发组", "desc": "开发团队", "status": 1}
    ],
    "last_login_at": "2026-02-28T10:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2026-02-28T10:00:00Z"
  }
}
```

### 2. 更新当前用户信息

**PUT** `/profile/me`

**请求体：**

```json
{
  "nickname": "新昵称",
  "email": "new@example.com",
  "phone": "13900139000",
  "avatar": "/uploads/avatar/2.png"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `nickname` | string | 否 | 昵称，最大 100 字符 |
| `email` | string | 否 | 邮箱，最大 128 字符 |
| `phone` | string | 否 | 手机号，最大 20 字符 |
| `avatar` | string | 否 | 头像地址，最大 512 字符 |

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "新昵称",
    "email": "new@example.com",
    "phone": "13900139000",
    "avatar": "/uploads/avatar/2.png",
    "status": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2026-02-28T12:00:00Z"
  }
}
```

### 3. 修改密码

**POST** `/profile/password`

> 用户修改自己的登录密码，需提供旧密码验证

**请求体：**

```json
{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword456!"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `old_password` | string | 是 | 当前密码，1-128 字符 |
| `new_password` | string | 是 | 新密码，8-128 字符 |

**响应示例：**

```json
{
  "code": 0,
  "msg": "success"
}
```

---

## 用户管理

> 所有接口需要认证和权限

### 1. 获取用户列表

**GET** `/users`

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码 |
| `page_size` | number | 否 | 每页数量 |

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "email": "admin@example.com",
      "phone": "13800138000",
      "avatar": "/uploads/avatar/1.png",
      "status": 1,
      "last_login_at": "2026-02-28T10:00:00Z",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. 分页获取用户

**GET** `/users/page`

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码 |
| `page_size` | number | 否 | 每页数量 |

**响应：** 分页格式

### 3. 创建用户

**POST** `/users`

**请求体：**

```json
{
  "username": "newuser",
  "nickname": "新用户",
  "password": "Password123!",
  "email": "newuser@example.com",
  "phone": "13800138000",
  "avatar": "",
  "status": 1,
  "roles": [1, 2],
  "groups": [1]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名，3-50 字符 |
| `nickname` | string | 否 | 昵称，最大 100 字符 |
| `password` | string | 是 | 密码，8-128 字符 |
| `email` | string | 否 | 邮箱，最大 128 字符 |
| `phone` | string | 否 | 手机号，最大 20 字符 |
| `avatar` | string | 否 | 头像地址，最大 512 字符 |
| `status` | number | 否 | 状态：0-禁用，1-启用 |
| `roles` | number[] | 否 | 角色 ID 列表 |
| `groups` | number[] | 否 | 用户组 ID 列表 |

### 4. 获取用户详情

**GET** `/users/:id`

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | number | 用户 ID |

### 5. 更新用户

**PUT** `/users/:id`

**请求体：**

```json
{
  "nickname": "更新昵称",
  "password": "NewPassword123!",
  "email": "updated@example.com",
  "phone": "13900139000",
  "avatar": "/uploads/avatar/2.png",
  "status": 1,
  "roles": [1, 2],
  "groups": [1]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `nickname` | string | 否 | 昵称 |
| `password` | string | 否 | 新密码（不填则不修改） |
| `email` | string | 否 | 邮箱，最大 128 字符 |
| `phone` | string | 否 | 手机号，最大 20 字符 |
| `avatar` | string | 否 | 头像地址，最大 512 字符 |
| `status` | number | 否 | 状态 |
| `roles` | number[] | 否 | 角色 ID 列表 |
| `groups` | number[] | 否 | 用户组 ID 列表 |

### 6. 删除用户

**DELETE** `/users/:id`

### 7. 修改密码

**POST** `/users/:id/password`

**请求体：**

```json
{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword456!"
}
```

### 8. 获取用户角色

**GET** `/users/:id/roles`

### 9. 获取用户所属组

**GET** `/users/:id/groups`

### 10. 导出用户

**GET** `/users/export`

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `format` | string | 否 | xlsx | 导出格式：csv, xlsx, json |

**响应：** 文件下载

---

## 角色管理

> 所有接口需要认证和权限

### 1. 获取角色列表

**GET** `/roles`

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码 |
| `page_size` | number | 否 | 每页数量 |

### 2. 分页获取角色

**GET** `/roles/page`

**响应：** 分页格式

### 3. 创建角色

**POST** `/roles`

**请求体：**

```json
{
  "name": "editor",
  "desc": "编辑员",
  "status": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 角色名，2-50 字符 |
| `desc` | string | 否 | 描述，最大 200 字符 |
| `status` | number | 否 | 状态：0-禁用，1-启用 |

### 4. 获取角色详情

**GET** `/roles/:id`

### 5. 更新角色

**PUT** `/roles/:id`

**请求体：** 同创建角色

### 6. 删除角色

**DELETE** `/roles/:id`

### 7. 设置角色菜单

**PUT** `/roles/:id/menus`

**请求体：**

```json
{
  "menu_ids": [1, 2, 3, 4]
}
```

### 8. 获取角色菜单

**GET** `/roles/:id/menus`

### 9. 导出角色

**GET** `/roles/export`

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `format` | string | 否 | xlsx | 导出格式：csv, xlsx, json |

---

## 用户组管理

> 所有接口需要认证和权限

### 1. 获取用户组列表

**GET** `/groups`

### 2. 分页获取用户组

**GET** `/groups/page`

### 3. 创建用户组

**POST** `/groups`

**请求体：**

```json
{
  "name": "开发组",
  "desc": "开发团队",
  "status": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 组名，2-50 字符 |
| `desc` | string | 否 | 描述，最大 200 字符 |
| `status` | number | 否 | 状态：0-禁用，1-启用 |

### 4. 获取用户组详情

**GET** `/groups/:id`

### 5. 更新用户组

**PUT** `/groups/:id`

### 6. 删除用户组

**DELETE** `/groups/:id`

### 7. 设置用户组角色

**PUT** `/groups/:id/roles`

**请求体：**

```json
{
  "roles": [1, 2]
}
```

### 8. 获取用户组成员

**GET** `/groups/:id/users`

---

## 菜单管理

> 所有接口需要认证和权限

### 1. 获取菜单列表

**GET** `/menus`

### 2. 获取菜单树

**GET** `/menus/tree`

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "parent_id": 0,
      "name": "system",
      "title": "系统管理",
      "path": "/system",
      "component": "Layout",
      "icon": "setting",
      "sort": 1,
      "type": 1,
      "hidden": false,
      "status": 1,
      "children": [
        {
          "id": 2,
          "parent_id": 1,
          "name": "user",
          "title": "用户管理",
          "path": "/system/user",
          "component": "system/user/index",
          "icon": "user",
          "sort": 1,
          "type": 2,
          "hidden": false,
          "status": 1,
          "children": []
        }
      ]
    }
  ]
}
```

### 3. 创建菜单

**POST** `/menus`

**请求体：**

```json
{
  "parent_id": 0,
  "name": "dashboard",
  "title": "仪表盘",
  "path": "/dashboard",
  "component": "dashboard/index",
  "icon": "dashboard",
  "sort": 0,
  "type": 1,
  "hidden": false,
  "status": 1,
  "method": ""
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `parent_id` | number | 否 | 父菜单 ID，0 表示顶级 |
| `name` | string | 是 | 路由名称，1-50 字符 |
| `title` | string | 是 | 菜单标题，1-100 字符 |
| `path` | string | 否 | 路由路径，最大 200 字符 |
| `component` | string | 否 | 组件路径，最大 200 字符 |
| `icon` | string | 否 | 图标，最大 50 字符 |
| `sort` | number | 否 | 排序，0-9999 |
| `type` | number | 否 | 类型：1-目录，2-菜单，3-按钮 |
| `hidden` | boolean | 否 | 是否隐藏 |
| `status` | number | 否 | 状态：0-禁用，1-启用 |
| `method` | string | 否 | HTTP 方法（按钮权限用） |

### 4. 获取菜单详情

**GET** `/menus/:id`

### 5. 更新菜单

**PUT** `/menus/:id`

### 6. 删除菜单

**DELETE** `/menus/:id`

### 7. 获取菜单关联角色

**GET** `/menus/:id/roles`

---

## 权限管理

> 所有接口需要认证和权限

### 1. 获取所有策略

**GET** `/permissions/policies`

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    ["role:1", "/api/v1/users", "GET"],
    ["role:1", "/api/v1/users", "POST"]
  ]
}
```

### 2. 添加策略

**POST** `/permissions/policies`

**请求体：**

```json
{
  "sub": "role:1",
  "obj": "/api/v1/users",
  "act": "GET"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `sub` | string | 是 | 主体（如 role:1） |
| `obj` | string | 是 | 资源路径 |
| `act` | string | 是 | 操作（GET/POST/PUT/DELETE） |

### 3. 删除策略

**DELETE** `/permissions/policies`

**请求体：** 同添加策略

### 4. 获取分组策略

**GET** `/permissions/grouping-policies`

### 5. 检查权限

**POST** `/permissions/check`

**请求体：**

```json
{
  "sub": "user:1",
  "obj": "/api/v1/users",
  "act": "GET"
}
```

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "allowed": true
  }
}
```

### 6. 获取用户角色

**GET** `/permissions/users/:user_id/roles`

### 7. 添加用户角色

**POST** `/permissions/users/:user_id/roles`

**请求体：**

```json
{
  "role": "role:admin"
}
```

### 8. 删除用户角色

**DELETE** `/permissions/users/:user_id/roles`

### 9. 获取用户权限

**GET** `/permissions/users/:user_id/permissions`

### 10. 刷新策略

**POST** `/permissions/reload`

---

## 字典管理

> 所有接口需要认证和权限

### 字典类型

#### 1. 分页获取字典类型

**GET** `/dict/types`

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码 |
| `page_size` | number | 否 | 每页数量 |

#### 2. 获取所有字典类型

**GET** `/dict/types/list`

#### 3. 创建字典类型

**POST** `/dict/types`

**请求体：**

```json
{
  "name": "性别",
  "code": "gender",
  "remark": "性别字典",
  "status": 1
}
```

#### 4. 获取字典类型详情

**GET** `/dict/types/:id`

#### 5. 更新字典类型

**PUT** `/dict/types/:id`

#### 6. 删除字典类型

**DELETE** `/dict/types/:id`

#### 7. 导出字典类型

**GET** `/dict/types/export`

### 字典数据

#### 1. 分页获取字典数据

**GET** `/dict/data`

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type_id` | number | 否 | 字典类型 ID |
| `page` | number | 否 | 页码 |
| `page_size` | number | 否 | 每页数量 |

#### 2. 根据类型编码获取字典数据

**GET** `/dict/data/type/:type_code`

> 常用于前端下拉框数据获取

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {"id": 1, "label": "男", "value": "1", "sort": 1},
    {"id": 2, "label": "女", "value": "2", "sort": 2}
  ]
}
```

#### 3. 创建字典数据

**POST** `/dict/data`

#### 4. 获取字典数据详情

**GET** `/dict/data/:id`

#### 5. 更新字典数据

**PUT** `/dict/data/:id`

#### 6. 删除字典数据

**DELETE** `/dict/data/:id`

---

## 系统配置

> 所有接口需要认证和权限（公开配置除外）

### 1. 获取公开配置

**GET** `/sysconfigs/public`

> 公开接口，无需认证

### 2. 分页获取配置

**GET** `/sysconfigs`

### 3. 创建配置

**POST** `/sysconfigs`

### 4. 获取配置详情

**GET** `/sysconfigs/:id`

### 5. 更新配置

**PUT** `/sysconfigs/:id`

### 6. 删除配置

**DELETE** `/sysconfigs/:id`

---

## 文件管理

> 所有接口需要认证和权限

### 1. 分页获取文件

**GET** `/files`

### 2. 上传文件

**POST** `/files`

**请求：** `multipart/form-data`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `file` | file | 是 | 文件 |

### 3. 获取文件详情

**GET** `/files/:id`

### 4. 删除文件

**DELETE** `/files/:id`

---

## 通知管理

> 用户通知接口需要认证，模板管理需要权限

### 用户通知

#### 1. 获取通知列表

**GET** `/notification/list`

#### 2. 获取未读数量

**GET** `/notification/unread-count`

**响应示例：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "count": 5
  }
}
```

#### 3. 标记全部已读

**PUT** `/notification/read-all`

#### 4. 删除全部通知

**DELETE** `/notification/all`

#### 5. 标记单条已读

**PUT** `/notification/:id/read`

#### 6. 删除单条通知

**DELETE** `/notification/:id`

### 通知模板（管理员）

#### 1. 分页获取模板

**GET** `/notification/templates`

#### 2. 获取模板列表

**GET** `/notification/templates/list`

#### 3. 创建模板

**POST** `/notification/templates`

#### 4. 获取模板详情

**GET** `/notification/templates/:id`

#### 5. 更新模板

**PUT** `/notification/templates/:id`

#### 6. 删除模板

**DELETE** `/notification/templates/:id`

---

## 定时任务

> 所有接口需要认证和权限

### 1. 分页获取任务

**GET** `/jobs`

### 2. 创建任务

**POST** `/jobs`

### 3. 获取任务详情

**GET** `/jobs/:id`

### 4. 更新任务

**PUT** `/jobs/:id`

### 5. 删除任务

**DELETE** `/jobs/:id`

### 6. 暂停任务

**POST** `/jobs/:id/pause`

### 7. 恢复任务

**POST** `/jobs/:id/resume`

### 8. 立即执行

**POST** `/jobs/:id/run`

### 9. 获取任务日志

**GET** `/jobs/:id/logs`

### 10. 分页获取所有日志

**GET** `/jobs/logs`

---

## 审计模块

> 所有接口需要认证和权限

### 审计概览

**GET** `/audit/overview`

### 操作日志

#### 1. 分页获取操作日志

**GET** `/audit/operations`

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码 |
| `page_size` | number | 否 | 每页数量 |
| `username` | string | 否 | 用户名（模糊搜索） |
| `module` | string | 否 | 模块名 |
| `action` | string | 否 | 操作类型 |
| `method` | string | 否 | HTTP 方法 |
| `ip` | string | 否 | IP 地址（模糊搜索） |
| `level` | string | 否 | 日志级别 |
| `status_code` | number | 否 | HTTP 状态码（如 200、500） |
| `start_time` | string | 否 | 开始时间 |
| `end_time` | string | 否 | 结束时间 |
| `keyword` | string | 否 | 关键词搜索 |

#### 2. 获取操作日志详情

**GET** `/audit/operations/:id`

#### 3. 按模块统计

**GET** `/audit/operations/stats/module`

#### 4. 按操作统计

**GET** `/audit/operations/stats/action`

#### 5. 清理旧日志

**DELETE** `/audit/operations/clean`

#### 6. 导出操作日志

**GET** `/audit/export/operations`

### 登录日志

#### 1. 分页获取登录日志

**GET** `/audit/logins`

#### 2. 获取用户登录日志

**GET** `/audit/logins/user/:id`

#### 3. 登录统计

**GET** `/audit/logins/stats`

#### 4. 清理旧日志

**DELETE** `/audit/logins/clean`

#### 5. 导出登录日志

**GET** `/audit/export/logins`

### 在线用户

#### 1. 分页获取在线用户

**GET** `/audit/online-users`

#### 2. 获取用户会话

**GET** `/audit/online-users/user/:id`

#### 3. 获取在线人数

**GET** `/audit/online-users/count`

#### 4. 强制下线（按会话）

**DELETE** `/audit/online-users/:id`

#### 5. 强制下线（按用户）

**POST** `/audit/online-users/user/:id/logout`

#### 6. 清理过期会话

**DELETE** `/audit/online-users/clean`

---

## 健康检查

> 公开接口，无需认证

### 1. 综合健康检查

**GET** `/health`

### 2. 存活探针

**GET** `/health/liveness`

> 始终返回 200，用于 K8s 存活检测

### 3. 就绪探针

**GET** `/health/readiness`

> 检查数据库、Redis 连接状态

### 4. 启动探针

**GET** `/health/startup`

---

## 前端集成建议

### 1. Axios 封装示例

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data;
    if (code === 0) {
      return data;
    }
    return Promise.reject(new Error(msg));
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期，尝试刷新
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post('/api/v1/auth/refresh', {
            refresh_token: refreshToken,
          });
          localStorage.setItem('access_token', res.data.data.access_token);
          localStorage.setItem('refresh_token', res.data.data.refresh_token);
          // 重试原请求
          return api(error.config);
        } catch {
          // 刷新失败，跳转登录
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. 错误码处理

```typescript
const errorMessages: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '没有操作权限',
  404: '请求的资源不存在',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
};

function handleError(code: number, msg: string) {
  const message = msg || errorMessages[code] || '未知错误';
  // 显示错误提示
  notification.error({ message });
}
```

### 3. 分页组件对接

```typescript
interface PageParams {
  page: number;
  page_size: number;
}

interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

async function fetchPageData<T>(
  url: string,
  params: PageParams
): Promise<PageResult<T>> {
  return api.get(url, { params });
}
```

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.2.0 | 2026-02-28 | 新增 POST `/profile/password` 个人密码修改接口；操作日志支持 `status_code` 筛选 |
| 1.1.0 | 2026-02-28 | 用户模型新增 email/phone/avatar 字段；新增个人信息接口 (GET/PUT `/profile/me`) |
| 1.0.0 | 2026-01-29 | 初始版本 |

