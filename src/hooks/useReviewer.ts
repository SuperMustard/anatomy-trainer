import { useMemo, useState } from "react";
import type { DropZone, PlacedMap } from "../types/anatomy";

export function useReviewer(zones: DropZone[]) {
  const [placed, setPlaced] = useState<PlacedMap>({});
  const [score, setScore] = useState(0);

  const labels = useMemo(() => {
    return zones.map((z) => z.label);
  }, [zones]);

  function reset() {
    setPlaced({});
    setScore(0);
  }

  function handleCorrect(zoneId: string, label: string) {
    if (placed[zoneId]) return;

    setPlaced((p) => ({ ...p, [zoneId]: label }));
    setScore((s) => s + 1);
  }

  return {
    labels,
    placed,
    score,
    total: zones.length,
    reset,
    handleCorrect,
  };
}
