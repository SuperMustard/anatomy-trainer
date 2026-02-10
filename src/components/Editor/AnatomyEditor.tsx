import { useState, type ChangeEvent } from "react";
import EditorCanvas from "../EditorCanvas/EditorCanvas";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { EditorBox } from "../../types/editor";

export default function AnatomyEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<EditorBox[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");

  const handleUpdate = (updatedBox: EditorBox) => {
    console.log("Updated box:", updatedBox);
    const newBoxes = boxes.map((b) =>
      b.id === updatedBox.id ? updatedBox : b,
    );
    setBoxes(newBoxes);
    console.log(Array.from(newBoxes.entries()));
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setImageName("../../assets/" + file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        x: 100,
        y: 100,
        text: "",
      },
    ]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event;

    setBoxes((prev) =>
      prev.map((b) =>
        b.id === active.id ? { ...b, x: b.x + delta.x, y: b.y + delta.y } : b,
      ),
    );
  };

  function downloadJSON(data: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleExport = async () => {
    if (!imageFile) {
      alert("Please upload an image first");
      return;
    }

    const config = {
      canvas: {
        width: 600,
        height: 600,
      },
      type: "drag-label",
      image: imageName,
      zones: boxes.map((b) => ({
        id: b.text,
        x: b.x,
        y: b.y,
        label: b.text,
      })),
    };

    downloadJSON(config, "anatomy-config.json");
  };

  return (
    <div style={{ padding: 24 }}>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <button onClick={addBox}>+ Add Box</button>
      <button onClick={handleExport}>Export JSON</button>

      {image && (
        <DndContext onDragEnd={handleDragEnd}>
          <EditorCanvas image={image} boxes={boxes} onUpdate={handleUpdate} />
        </DndContext>
      )}
    </div>
  );
}
