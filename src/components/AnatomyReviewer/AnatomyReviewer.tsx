import { useEffect, useRef, useState } from "react";
import type { TrainerConfig } from "../../types/anatomy";
import styles from "./AnatomyReviewer.module.scss";
import DragLabelCanvas from "../DragLabelCanvas/DragLabelCanvas";
import MultipleChoicesCanvas from "../MultipleChoicesCanvas.tsx/MultipleChoicesCanvas";

export default function AnatomyReviewer() {
  const [config, setConfig] = useState<TrainerConfig | null>(null);
  const [index, setIndex] = useState(0);

  const loadedRef = useRef(false);

  const loadConfig = async () => {
    const res = await fetch("/datas/chapter1.json");
    const json = await res.json();
    setConfig(json);
    setIndex(0);
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    (async () => {
      await loadConfig();
    })();
  }, []);

  const current = config?.questions[index];
  function next() {
    if (!config) return;
    setIndex((i) => Math.min(i + 1, config.questions.length - 1));
  }

  const prev = () => {
    setIndex((i) => Math.max(i - 1, 0));
  };

  const renderContent = () => {
    switch (current?.type) {
      case "drag-label":
        return <DragLabelCanvas questions={current} index={index} />;
      case "multiple-choice":
        return <MultipleChoicesCanvas key={index} question={current} />;
      default:
        return <h1>Unsupported question type</h1>; // 兜底处理
    }
  };

  return (
    <div>
      {renderContent()}
      <div className={styles.nav}>
        <button onClick={prev} disabled={index === 0}>
          ◀ Prev
        </button>

        <span>
          {index + 1} / {config?.questions.length ?? 0}
        </span>

        <button
          onClick={next}
          disabled={index === (config?.questions.length ?? 1) - 1}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
