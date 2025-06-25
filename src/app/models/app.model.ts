import { GameControlAction, GameControlType } from "./app.enums";

export interface GameControl {
  id: GameControlAction;
  name: string;
  type: GameControlType;
  options?: GameControlOption[];
}

export interface GameControlOption {
  id: number;
  name: string;
}