import { useDraggable } from "@dnd-kit/core";
import styles from "./SortableBox.module.scss";
import type { EditorBox } from "../../types/editor";
import { useEffect, useState } from "react";

type Props = {
  box: EditorBox;
  onUpdate?: (updatedBox: EditorBox) => void;
};

export default function SortableBox({ box, onUpdate }: Props) {
  const [localBox, setLocalBox] = useState(box);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: localBox.id,
  });

  useEffect(() => {
    setLocalBox(box);
  }, [box]);

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const syncToParent = (updated: EditorBox) => {
    setLocalBox(updated);
    onUpdate?.(updated); // 通知父组件
  };

  // const handleDragEnd = () => {
  //   if (transform) {
  //     const updated = {
  //       ...localBox,
  //       x: localBox.x + transform.x,
  //       y: localBox.y + transform.y,
  //     };
  //     syncToParent(updated);
  //   }
  // };

  return (
    <div
      ref={setNodeRef}
      className={styles.box}
      style={{
        left: localBox.x,
        top: localBox.y,
        ...style,
      }}
    >
      <div className={styles.dragHandle} {...listeners} {...attributes}>
        ☰
      </div>
      <input
        className={styles.input}
        value={localBox.text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setLocalBox({ ...localBox, text: e.target.value });
        }}
        onBlur={() => {
          syncToParent(localBox);
        }}
        // 3. 按回车也可以触发同步（可选）
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
    </div>
  );
}
