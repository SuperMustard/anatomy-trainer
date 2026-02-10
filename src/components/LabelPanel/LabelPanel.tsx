import { useDraggable } from "@dnd-kit/core";
import styles from "./LabelPanel.module.scss";

interface Props {
  labels: string[];
  placed: Record<string, string>;
}

function Label({ text }: { text: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: text,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={styles.label}
      style={style}
    >
      {text}
    </div>
  );
}

export default function LabelPanel({ labels, placed }: Props) {
  return (
    <div className={styles.panel}>
      {labels
        .filter((l) => !placed[l])
        .map((l) => (
          <Label key={l} text={l} />
        ))}
    </div>
  );
}
