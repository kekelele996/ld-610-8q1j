import { useEffect } from "react";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { RelicConditionText } from "../constants/RelicCondition";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";

export function RelicsPage() {
  const rows = useRelicItemStore((state) => state.rows);
  const load = useRelicItemStore((state) => state.load);

  useEffect(() => {
    void load();
  }, [load]);

  if (rows.length === 0) return <EmptyState title="藏品加载中…" />;

  return (
    <section className="page-body">
      <div className="damage-grid">
        {rows.map((relic) => (
          <article key={relic.id} className="panel damage-card">
            <header className="damage-card-head">
              <div>
                <h3>
                  {relic.name} <span className="muted">{relic.relic_code}</span>
                </h3>
                <p className="plan-sub">
                  {relic.era} · {relic.material} · {relic.collection_level}
                </p>
              </div>
              <StatusBadge value={relic.current_condition} text={RelicConditionText[relic.current_condition as keyof typeof RelicConditionText]} />
            </header>
            <p className="damage-meta">存放位置：{relic.storage_location}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
