import { BaseComponent } from '../abstract/BaseComponent';

export class PowerReserveIndicator extends BaseComponent {
    private _displayHours: number;
    
    constructor(material: string = 'Steel') {
        super('Power Reserve Indicator', material);
        this._displayHours = 42; // 42-hour power reserve
    }
    
    operate(): void {
        console.log(`${this.name} showing ${this._displayHours} hours remaining`);
    }
    
    updateReserve(mainspringTension: number): void {
        this._displayHours = Math.floor((mainspringTension / 100) * 42);
    }
    
    get hoursRemaining(): number { return this._displayHours; }
}