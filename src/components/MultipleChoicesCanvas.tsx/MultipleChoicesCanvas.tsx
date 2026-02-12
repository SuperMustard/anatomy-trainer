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
    name: "" as string,
    origin: [] as string[],
    insertion: [] as string[],
    actions: [] as string[],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. 文本输入处理
  const handleTextChange = (val: string) => {
    if (isSubmitted) return;
    setSelected((prev) => ({ ...prev, name: val }));
  };

  // 2. 切换逻辑
  const toggle = (key: "origin" | "insertion" | "actions", value: string) => {
    if (isSubmitted) return; // 提交后禁止修改
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  // 渲染文本输入框 (针对 Name)
  const renderNameInput = () => {
    const correctAnswer = multipleChoicesQuestion?.answer?.name[0]; // 假设答案数组第一个是标准答案
    const isRight =
      selected.name.trim().toLowerCase() === correctAnswer?.toLowerCase();

    return (
      <div className={styles.inputGroup}>
        <h3>Name</h3>
        <input
          type="text"
          value={selected.name}
          disabled={isSubmitted}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type the muscle name..."
          className={
            isSubmitted
              ? isRight
                ? styles.correctInput
                : styles.wrongInput
              : ""
          }
        />
        {isSubmitted && (
          <div style={{ marginTop: "4px", fontSize: "0.9em" }}>
            {isRight ? (
              <span style={{ color: "green" }}>✓ Correct</span>
            ) : (
              <span style={{ color: "red" }}>✗ Answer: {correctAnswer}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderGroup = (
    title: string,
    key: "origin" | "insertion" | "actions",
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
    // 校验文本 (Name)
    const nameCorrect =
      selected.name.trim().toLowerCase() ===
      multipleChoicesQuestion?.answer?.name[0]?.toLowerCase();

    // 2. Safe array comparison
    const keys = ["origin", "insertion", "actions"] as const;

    const othersCorrect = keys.every((key) => {
      // Fallback to empty arrays to prevent spread/sort errors
      const selectedArr = selected[key] ?? [];
      const answerArr = multipleChoicesQuestion?.answer?.[key] ?? [];

      if (selectedArr.length !== answerArr.length) return false;

      // Create a copy before sorting to avoid mutating state (though spread does this)
      const sortedSelected = [...selectedArr].sort();
      const sortedAnswer = [...answerArr].sort();

      return JSON.stringify(sortedSelected) === JSON.stringify(sortedAnswer);
    });

    return nameCorrect && othersCorrect;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasSection}>
        <BaseImageCanvas image={imgSrc}></BaseImageCanvas>
      </div>
      <div className={styles.optionsSection}>
        {renderNameInput()}
        {renderGroup("Origin", "origin")}
        {renderGroup("Insertion", "insertion")}
        {renderGroup("Actions", "actions")}
        <hr></hr>
        {renderFooter()}
      </div>
    </div>
  );
}
