import { BaseComponent } from '../abstract/BaseComponent';
import { Timekeeping } from '../interfaces/WatchComponent';

export class Mainspring extends BaseComponent {
    private _tension: number;
    private _maxTension: number;

    constructor(material: string = 'Steel') {
        super('Mainspring', material);
        this._tension = 100; // Fully wound
        this._maxTension = 100;
    }

    operate(): void {
        if (this._tension > 0) {
            this._tension -= 0.1; // Loses tension over time
            console.log(`${this.name} providing power - tension: ${this._tension.toFixed(1)}%`);
        } else {
            this.setWorking(false);
            console.log(`${this.name} needs winding!`);
        }
    }

    wind(): void {
        this._tension = this._maxTension;
        this.setWorking(true);
        console.log(`${this.name} fully wound`);
    }

    get tension(): number { return this._tension; }
}

export class BalanceWheel extends BaseComponent implements Timekeeping {
    private _frequency: number; // beats per hour
    private _currentTime: Date;

    constructor(material: string = 'Brass') {
        super('Balance Wheel', material);
        this._frequency = 28800; // 28,800 beats per hour (4Hz)
        this._currentTime = new Date();
    }

    operate(): void {
        this.tick();
    }

    tick(): void {
        // Simulate the tick-tock
        console.log('Tick-tock');
        this._currentTime = new Date(this._currentTime.getTime() + 1000); // Add 1 second
    }

    getCurrentTime(): Date {
        return this._currentTime;
    }

    get frequency(): number { return this._frequency; }
}

export class Escapement extends BaseComponent {
    private _isReleasing: boolean;

    constructor(material: string = 'Steel') {
        super('Escapement', material);
        this._isReleasing = false;
    }

    operate(): void {
        this._isReleasing = !this._isReleasing;
        console.log(`${this.name} ${this._isReleasing ? 'releasing' : 'catching'} energy`);
    }
}
