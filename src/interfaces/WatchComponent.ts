export interface WatchComponent {
    name: string;
    material: string;
    isWorking: boolean;
    
    operate(): void;
    getStatus(): string;
}

export interface Moveable {
    move(): void;
    stop(): void;
}

export interface Timekeeping {
    tick(): void;
    getCurrentTime(): Date;
}
