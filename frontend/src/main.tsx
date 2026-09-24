import { useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { StatusBadge } from "./components/common/StatusBadge";
import { DashboardPage } from "./pages/DashboardPage";
import { RelicsPage } from "./pages/RelicsPage";
import { DamagesPage } from "./pages/DamagesPage";
import { PlansPage } from "./pages/PlansPage";
import { ImagesPage } from "./pages/ImagesPage";
import "./styles.css";

const PAGE_COMPONENTS: Record<string, () => JSX.Element> = {
  "/dashboard": DashboardPage,
  "/relics": RelicsPage,
  "/damages": DamagesPage,
  "/plans": PlansPage,
  "/images": ImagesPage
};

function PageShell({ route, name }: { route: string; name: string }) {
  const Current = PAGE_COMPONENTS[route] ?? DashboardPage;
  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>{name}</h1>
        </div>
        <StatusBadge value="LOCAL_DATA" text="本地数据库" />
      </section>
      <Current />
    </main>
  );
}

function App() {
  const [active, setActive] = useState<string>(routes[0]?.route ?? "/dashboard");
  const current = routes.find((route) => route.route === active) ?? routes[0];
  return (
    <div className="shell">
      <aside>
        <div className="brand">文物修复档案协作平台</div>
        <nav>
          {routes.map((route) => (
            <button
              key={route.route}
              type="button"
              className={active === route.route ? "active" : ""}
              onClick={() => setActive(route.route)}
            >
              {route.name}
            </button>
          ))}
        </nav>
      </aside>
      <PageShell key={current.route} route={current.route} name={current.name} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
