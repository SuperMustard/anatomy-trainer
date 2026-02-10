import { useEffect, useRef } from "react";
import type { DragLabelQuestion, Question } from "../../types/anatomy";
import { useReviewer } from "../../hooks/useReviewer";
import type { DragEndEvent } from "@dnd-kit/core/dist/types/events";
import AnatomyCanvas from "../AnatomyCanvas/AnatomyCanvas";
import LabelPanel from "../LabelPanel/LabelPanel";
import { DndContext } from "@dnd-kit/core";
import styles from "./DragLabelCanvas.module.scss";

export default function DragLabelCanvas({
  questions,
  index,
}: {
  questions: Question;
  index: number;
}) {
  const dragLabelQuestion = questions as DragLabelQuestion;
  const zonesData = dragLabelQuestion?.zones ?? [];
  const image = dragLabelQuestion?.image ?? "";

  const zones = zonesData.map(
    (zone: { id: string; x: number; y: number; label: string }) => ({
      id: zone.id,
      label: zone.label,
      x: zone.x,
      y: zone.y,
    }),
  );

  const reviewer = useReviewer(zones);
  const resetRef = useRef(reviewer.reset);

  useEffect(() => {
    resetRef.current = reviewer.reset;
  });

  useEffect(() => {
    resetRef.current(); // 调用保存的最新的 reset
  }, [index]); // 这样就只需要依赖 index

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const label = active.id.toString();
    const zone = over.id.toString();

    if (label === zone && !reviewer.placed[zone]) {
      reviewer.handleCorrect(zone, label);
    } else {
      alert("❌ Wrong position");
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.wrapper}>
        <AnatomyCanvas zones={zones} placed={reviewer.placed} image={image} />
        <LabelPanel labels={reviewer.labels} placed={reviewer.placed} />
      </div>

      <div className={styles.score}>
        Score: {reviewer.score} / {reviewer.total}
      </div>
    </DndContext>
  );
}
