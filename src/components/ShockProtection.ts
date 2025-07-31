import { BaseComponent } from '../abstract/BaseComponent';

export class ShockProtection extends BaseComponent {
    private _impactResistance: number;
    private _isActive: boolean;
    
    constructor(type: string = 'Incabloc', material: string = 'Steel') {
        super(`${type} Shock Protection`, material);
        this._impactResistance = 5000; // G-force resistance
        this._isActive = true;
    }
    
    operate(): void {
        if (this._isActive) {
            console.log(`${this.name} protecting against impacts up to ${this._impactResistance}G`);
        }
    }
    
    receiveShock(force: number): boolean {
        if (force > this._impactResistance) {
            this._isActive = false;
            this.setWorking(false);
            console.log(`${this.name} damaged by ${force}G impact!`);
            return false;
        }
        return true;
    }
}