import BaseImageCanvas from "../BaseImageCanvas/BaseImageCanvas";
import SortableBox from "../SortableBox/SortableBox";
import type { EditorBox } from "../../types/editor";

type Props = {
  image: string;
  boxes: EditorBox[];
  onUpdate?: (updatedBox: EditorBox) => void;
};

export default function EditorCanvas({ image, boxes, onUpdate }: Props) {
  return (
    <BaseImageCanvas image={image}>
      {boxes.map((box) => (
        <SortableBox key={box.id} box={box} onUpdate={onUpdate} />
      ))}
    </BaseImageCanvas>
  );
}
