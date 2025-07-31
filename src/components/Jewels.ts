import { BaseComponent } from '../abstract/BaseComponent';

export class Jewel extends BaseComponent {
    private _friction: number;
    private _wearLevel: number;
    
    constructor(position: string, material: string = 'Ruby') {
        super(`${position} Jewel`, material);
        this._friction = 0.1;
        this._wearLevel = 0;
    }
    
    operate(): void {
        this._wearLevel += 0.001;
        if (this._wearLevel > 10) {
            this.setWorking(false);
            console.log(`${this.name} needs replacement - high wear`);
        } else {
            console.log(`${this.name} reducing friction by ${(1 - this._friction) * 100}%`);
        }
    }
    
    get friction(): number { return this._friction; }
    get wearLevel(): number { return this._wearLevel; }
}