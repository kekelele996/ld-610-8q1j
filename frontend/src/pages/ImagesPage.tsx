import { useEffect } from "react";
import { useImageVersionStore } from "../stores/ImageVersionStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { formatDate } from "../utils/formatters";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";

export function ImagesPage() {
  const rows = useImageVersionStore((state) => state.rows);
  const load = useImageVersionStore((state) => state.load);
  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);

  useEffect(() => {
    void load();
    void loadRelics();
  }, [load, loadRelics]);

  if (rows.length === 0) return <EmptyState title="影像版本加载中…" />;

  return (
    <section className="page-body">
      <div className="damage-grid">
        {rows.map((image) => {
          const relic = relics.find((item) => item.id === image.relic_id);
          return (
            <article key={image.id} className="panel damage-card">
              <header className="damage-card-head">
                <div>
                  <h3>
                    {image.version_no} <span className="muted">{image.file_path}</span>
                  </h3>
                  <p className="plan-sub">{relic ? `${relic.relic_code} · ${relic.name}` : `文物 #${image.relic_id}`}</p>
                </div>
                <StatusBadge value={image.image_type} />
              </header>
              <p className="damage-meta">拍摄时间：{formatDate(image.capture_at)}</p>
              <p className="damage-position">{image.note}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
