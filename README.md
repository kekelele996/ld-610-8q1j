# 文物修复档案协作平台

面向博物馆修复团队的文物病害记录、修复方案、影像版本和审批归档平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20110>

后端健康检查：<http://localhost:21110/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Ant Design + Zustand |
| 后端 | NestJS + TypeScript + Prisma |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `relic-restore`
- `FRONTEND_PORT`: 前端端口，默认 `20110`
- `BACKEND_PORT`: 后端端口，默认 `21110`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: relic-restore`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-relic-restore}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 修复方案审批流程

修复方案页（`/plans`）是可操作的审批闭环，而不只是只读列表：

1. 修复师在**病害记录页**（`/damages`）对“已登记”且尚无在途方案的病害点击「转修复方案」，生成 **DRAFT（草稿）** 方案；已进入修复（IN_RESTORATION）或已关闭（CLOSED）的病害按钮禁用，不能再转新方案。
2. 草稿或被驳回方案可「提交审批」，状态变为 **SUBMITTED（提交中）**。
3. **专家**角色（页面右上角角色切换器选择“专家”）可对提交中的方案：
   - **批准**：记录 `approved_by`（审批人）与 `approved_at`（审批时间），同时把关联病害状态自动置为 **IN_RESTORATION（修复中）**；
   - **驳回**：必须填写驳回原因，原因持久化在 `rejection_reason`，方案回到 **REJECTED（已驳回）**，修复师修改后可重新提交。
4. 方案一旦 **APPROVED（已批准）**，其修复方法与风险说明立即锁定，表单只读，后端 `PATCH` 同样以 `PLAN_LOCKED` 拒绝越权修改。
5. 病害记录页每张卡片都展示关联方案及当前审批状态（含审批人/时间/驳回原因）。

接口：`POST/PATCH /api/restoration-plan`、`POST /api/restoration-plan/:id/submit|approve|reject`；批准/驳回由 `rbacMiddleware(["EXPERT"])` 强制专家权限。

## 枚举/常量出现位置清单

- RelicCondition: 前后端 `constants/RelicCondition`、`types`、DTO 构造器、`logTemplates`、`errorMessages`、RelicsPage/DashboardPage 筛选与展示组件均有引用。
- PlanApprovalStatus: 前后端 `constants/PlanApprovalStatus`、`types/PlanApprovalStatus`、方案构造器、`PlanDecisionConstructor`、`logTemplates`、`errorMessages`、PlansPage 状态筛选 chip、StatusBadge、ApprovalTimeline、后端 service/controller/routes 均有引用。
- DamageSeverity: 前后端 `constants/DamageSeverity`、`types`、构造器、`logTemplates`、`errorMessages`、DamagesPage/DashboardPage 筛选与 SeverityBadge 展示均有引用。
- DamageStatus（REGISTERED / IN_RESTORATION / CLOSED）: 前后端 `constants/DamageStatus`、`DamageRecordPayload`、病害构造器、后端 `DamageRecordService` 审批联动、DamagesPage 筛选与状态徽章；批准方案时由后端把病害从 REGISTERED 联动到 IN_RESTORATION。
- UserRole（RESTORER / EXPERT / ARCHIVIST / VISITOR）: 前后端 `constants/UserRole`、`authMiddleware`/`rbacMiddleware`、前端 RoleSwitcher 与 `usePlanApproval` 按钮显隐。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
