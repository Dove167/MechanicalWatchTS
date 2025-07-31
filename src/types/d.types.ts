export interface WatchComponent {
  id: string;
  name: string;
  type: ComponentType;
  status: ComponentStatus;
  health: number; // 0-100
  rotationSpeed?: number; // RPM
  position: Position;
  dependencies?: string[]; // IDs of components this depends on
}

export interface Position {
  x: number;
  y: number;
  rotation: number;
}

export enum ComponentType {
  MAINSPRING = 'mainspring',
  CENTER_WHEEL = 'center_wheel',
  THIRD_WHEEL = 'third_wheel',
  FOURTH_WHEEL = 'fourth_wheel',
  ESCAPE_WHEEL = 'escape_wheel',
  BALANCE_WHEEL = 'balance_wheel',
  PALLET_FORK = 'pallet_fork',
  JEWEL = 'jewel',
  GEAR_TRAIN = 'gear_train'
}

export enum ComponentStatus {
  RUNNING = 'running',
  STOPPED = 'stopped',
  DAMAGED = 'damaged',
  NEEDS_SERVICE = 'needs_service'
}

export interface WatchState {
  isRunning: boolean;
  currentTime: Date;
  powerReserve: number; // hours remaining
  components: Map<string, WatchComponent>;
  beatRate: number; // beats per hour
  accuracy: number; // seconds per day deviation
}

export interface MovementSpecs {
  caliber: string;
  jewels: number;
  frequency: number; // Hz
  powerReserve: number; // hours
  functions: string[];
}

export interface WatchSettings {
  brand: string;
  model: string;
  movement: MovementSpecs;
  complications: Complication[];
}

export enum Complication {
  DATE = 'date',
  GMT = 'gmt',
  CHRONOGRAPH = 'chronograph',
  MOON_PHASE = 'moon_phase',
  POWER_RESERVE = 'power_reserve'
}