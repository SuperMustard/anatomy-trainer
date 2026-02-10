import skeletons from "./skeleton.json";

export const SYSTEMS = {
  skeleton: {
    name: "Skeletons",
    data: skeletons,
  },
};

export type SystemKey = keyof typeof SYSTEMS;
