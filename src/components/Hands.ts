import { BaseComponent } from '../abstract/BaseComponent';
import { Moveable } from '../interfaces/WatchComponent';

export abstract class Hand extends BaseComponent implements Moveable {
    protected _angle: number;
    protected _length: number;
    protected _isMoving: boolean;

    constructor(name: string, material: string, length: number) {
        super(name, material);
        this._angle = 0;
        this._length = length;
        this._isMoving = false;
    }

    abstract move(): void;
    
    stop(): void {
        this._isMoving = false;
        console.log(`${this.name} stopped moving`);
    }

    get angle(): number { return this._angle; }
    get length(): number { return this._length; }
}

export class HourHand extends Hand {
    constructor(material: string = 'Steel') {
        super('Hour Hand', material, 8); // 8mm length
    }

    operate(): void {
        console.log(`${this.name} pointing to ${Math.floor(this._angle / 30)} o'clock`);
    }

    move(): void {
        this._isMoving = true;
        // Hour hand moves 0.5 degrees per minute
        this._angle = (this._angle + 0.5) % 360;
    }
}

export class MinuteHand extends Hand {
    constructor(material: string = 'Steel') {
        super('Minute Hand', material, 12); // 12mm length
    }

    operate(): void {
        console.log(`${this.name} pointing to ${Math.floor(this._angle / 6)} minutes`);
    }

    move(): void {
        this._isMoving = true;
        // Minute hand moves 6 degrees per minute
        this._angle = (this._angle + 6) % 360;
    }
}

export class SecondHand extends Hand {
    constructor(material: string = 'Steel') {
        super('Second Hand', material, 14); // 14mm length
    }

    operate(): void {
        console.log(`${this.name} pointing to ${Math.floor(this._angle / 6)} seconds`);
    }

    move(): void {
        this._isMoving = true;
        // Second hand moves 6 degrees per second
        this._angle = (this._angle + 6) % 360;
    }
}
