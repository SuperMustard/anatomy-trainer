import type { UniqueIdentifier } from "@dnd-kit/core";

export interface DropZone {
  id: string;
  label: string;
  x: number;
  y: number;
}

export type Question = DragLabelQuestion | MultipleChoiceQuestion;

export interface TrainerConfig {
  questions: Question[];
}

export interface DragLabelQuestion {
  type: "drag-label";
  image: string;
  zones: {
    id: string;
    x: number;
    y: number;
    label: string;
  }[];
}

export interface MultipleChoiceQuestion {
  type: "multiple-choice";
  image: string;
  muscleName: string;

  options: {
    name: string[];
    origin: string[];
    insertion: string[];
    actions: string[];
  };

  answer: {
    name: string[];
    origin: string[];
    insertion: string[];
    actions: string[];
  };
}

export interface ZoneProps {
  id: UniqueIdentifier;
  x: number | string;
  y: number | string;
  value?: React.ReactNode;
}

export type PlacedMap = Record<string, string>;
