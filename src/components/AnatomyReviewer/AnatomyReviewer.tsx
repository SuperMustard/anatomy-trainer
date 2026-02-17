import { useEffect, useState } from "react";
import type { TrainerConfig } from "../../types/anatomy";
import styles from "./AnatomyReviewer.module.scss";
import DragLabelCanvas from "../DragLabelCanvas/DragLabelCanvas";
import MultipleChoicesCanvas from "../MultipleChoicesCanvas.tsx/MultipleChoicesCanvas";

const CHAPTERS = [
  { id: "chapter1", label: "Upper Body Procubitus" },
  { id: "chapter2", label: "Upper Body Decubitus" },
];

export default function AnatomyReviewer() {
  const [config, setConfig] = useState<TrainerConfig | null>(null);
  const [index, setIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(CHAPTERS[0].id);

  // 当 currentChapter 改变时，触发重新加载
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`/datas/${currentChapter}.json`);
        const json = await res.json();
        setConfig(json);
        setIndex(0); // 切换章节时重置题目索引
      } catch (error) {
        console.error("加载数据失败:", error);
      }
    };
    loadConfig();
  }, [currentChapter]);

  const current = config?.questions[index];

  const next = () => {
    if (!config) return;
    setIndex((i) => Math.min(i + 1, config.questions.length - 1));
  };

  const prev = () => {
    setIndex((i) => Math.max(i - 1, 0));
  };

  const renderContent = () => {
    if (!config) return <div>Loading...</div>;

    switch (current?.type) {
      case "drag-label":
        return (
          <DragLabelCanvas
            key={`${currentChapter}-${index}`}
            questions={current}
            index={index}
          />
        );
      case "multiple-choice":
        return (
          <MultipleChoicesCanvas
            key={`${currentChapter}-${index}`}
            question={current}
          />
        );
      default:
        return <h1>Unsupported question type</h1>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {CHAPTERS.map((ch) => (
          <button
            key={ch.id}
            className={currentChapter === ch.id ? styles.active : ""}
            onClick={() => setCurrentChapter(ch.id)}
          >
            {ch.label}
          </button>
        ))}
      </div>

      <div className={styles.wrapper}>{renderContent()}</div>
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
