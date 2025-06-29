import { Difficulty, DragDirection, GameControlAction, GameControlType, VehicleType } from "./app.enums";

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

export interface Vehicle {
  id: number;
  type: VehicleType;
  x: number;
  y: number;
  cols: number;
  rows: number;
  color: string;
  dragging: DragDirection;
}

export interface NewGameRequest {
  size: number;
  difficulty: Difficulty;
}

export interface NewGameResponse {
  gridWidth: number;
  gridHeight: number;
  vehicles: Vehicle[];
  exitRow: number;
  solvableMovesEstimate: number;
}

export interface ValidateGameRequest {
  vehicles: Vehicle[];
  exitRow: number;
  gridWidth: number;
  gridHeight: number;
}

export interface ValidateGameResponse {
  valid: boolean;
  message?: string;
  error?: string;
}