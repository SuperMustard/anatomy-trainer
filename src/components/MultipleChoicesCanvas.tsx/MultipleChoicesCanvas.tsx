import type { Question, MultipleChoiceQuestion } from "../../types/anatomy";
import BaseImageCanvas from "../BaseImageCanvas/BaseImageCanvas";
import { useState } from "react";
import styles from "./MultipleChoicesCanvas.module.scss";

export default function MultipleChoicesCanvas({
  question,
}: {
  question: Question;
}) {
  const imgSrc = new URL(question.image, import.meta.url).href;

  const multipleChoicesQuestion = question as MultipleChoiceQuestion;

  // 1. 状态管理
  const [selected, setSelected] = useState({
    name: [] as string[],
    origin: [] as string[],
    insertion: [] as string[],
    actions: [] as string[],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. 切换逻辑
  const toggle = (key: keyof typeof selected, value: string) => {
    if (isSubmitted) return; // 提交后禁止修改
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const renderGroup = (
    title: string,
    key: "name" | "origin" | "insertion" | "actions",
  ) => {
    const options = multipleChoicesQuestion?.options?.[key];
    const answer = multipleChoicesQuestion?.answer?.[key];
    //const isCorrect = JSON.stringify(selected[key].sort()) === JSON.stringify(answer.sort());

    return (
      <div>
        <h3>{title}</h3>
        {options.map((opt: string) => {
          // 判断逻辑
          const isChecked = selected?.[key].includes(opt);
          const isCorrect = answer?.includes(opt);

          let style = {};
          if (isSubmitted) {
            if (isCorrect)
              style = { color: "green", fontWeight: "bold" }; // 正确答案绿了
            else if (isChecked && !isCorrect) style = { color: "red" }; // 选错的红了
          }

          return (
            <label key={opt} style={{ display: "block", ...style }}>
              <input
                type="checkbox"
                disabled={isSubmitted}
                checked={isChecked}
                onChange={() => toggle(key, opt)}
              />
              {opt} {isSubmitted && isCorrect && "✓"}
              {isSubmitted && isChecked && !isCorrect && "✗"}
            </label>
          );
        })}
      </div>
    );
  };

  // 4. 使用 Switch 或条件渲染切换底部按钮
  const renderFooter = () => {
    if (!isSubmitted) {
      return <button onClick={() => setIsSubmitted(true)}>Submit</button>;
    } else {
      return (
        <div>
          <p>
            Result: {checkIfAllCorrect() ? "✅ Excellent!" : "❌ Try Again"}
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false); /* 可以重置 selected */
            }}
          >
            Retry
          </button>
        </div>
      );
    }
  };

  const checkIfAllCorrect = () => {
    // 简单的数组比对逻辑
    return Object.keys(selected).every((key) => {
      const k = key as keyof typeof selected;
      return (
        JSON.stringify(selected?.[k].sort()) ===
        JSON.stringify(multipleChoicesQuestion?.answer?.[k].sort())
      );
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasSection}>
        <BaseImageCanvas image={imgSrc}></BaseImageCanvas>
      </div>
      <div className={styles.optionsSection}>
        {renderGroup("Name", "name")}
        {renderGroup("Origin", "origin")}
        {renderGroup("Insertion", "insertion")}
        {renderGroup("Actions", "actions")}
        <hr></hr>
        {renderFooter()}
      </div>
    </div>
  );
}
