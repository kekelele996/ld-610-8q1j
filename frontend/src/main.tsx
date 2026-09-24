import { useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { routes } from "./router/routes";
import { DashboardPage } from "./pages/DashboardPage";
import { RelicsPage } from "./pages/RelicsPage";
import { DamagesPage } from "./pages/DamagesPage";
import { PlansPage } from "./pages/PlansPage";
import { ImagesPage } from "./pages/ImagesPage";
import "./styles.css";

const pages: Record<string, ComponentType> = {
  "/dashboard": DashboardPage,
  "/relics": RelicsPage,
  "/damages": DamagesPage,
  "/plans": PlansPage,
  "/images": ImagesPage
};

function App() {
  const [active, setActive] = useState<string>(routes[0]?.route ?? "/dashboard");
  const Current = pages[active] ?? DashboardPage;
  return (
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <div className="shell">
          <aside>
            <div className="brand">文物修复档案协作平台</div>
            <nav>{routes.map((route) => <button key={route.route} className={active === route.route ? "active" : ""} onClick={() => setActive(route.route)}>{route.name}</button>)}</nav>
          </aside>
          <Current />
        </div>
      </AntdApp>
    </ConfigProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
