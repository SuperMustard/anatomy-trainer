import { useDroppable } from "@dnd-kit/core";
import type { DropZone, PlacedMap, ZoneProps } from "../../types/anatomy";
import BaseImageCanvas from "../BaseImageCanvas/BaseImageCanvas";
import styles from "./AnatomyCanvas.module.scss";

interface Props {
  zones: DropZone[];
  placed: PlacedMap;
  image: string;
}

function Zone({ id, x, y, value }: ZoneProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={styles.zone} style={{ left: x, top: y }}>
      {value}
    </div>
  );
}

export default function AnatomyCanvas({ zones, placed, image }: Props) {
  const imgSrc = new URL(image, import.meta.url).href;

  return (
    <BaseImageCanvas image={imgSrc}>
      {zones.map((z) => (
        <Zone key={z.id} id={z.id} x={z.x} y={z.y} value={placed[z.id]} />
      ))}
    </BaseImageCanvas>
  );
}
