import { BaseComponent } from '../abstract/BaseComponent';

export class Regulator extends BaseComponent {
    private _regulation: number; // seconds per day fast/slow
    private _position: 'F' | 'S' | 'N'; // Fast, Slow, Neutral
    
    constructor(material: string = 'Steel') {
        super('Regulator', material);
        this._regulation = 0;
        this._position = 'N';
    }
    
    operate(): void {
        const adjustment = this._position === 'F' ? '+' : this._position === 'S' ? '-' : '±';
        console.log(`${this.name} set to ${this._position}: ${adjustment}${Math.abs(this._regulation)} sec/day`);
    }
    
    adjustRegulation(direction: 'faster' | 'slower'): void {
        if (direction === 'faster') {
            this._regulation = Math.min(this._regulation + 10, 60);
            this._position = 'F';
        } else {
            this._regulation = Math.max(this._regulation - 10, -60);
            this._position = 'S';
        }
    }
}