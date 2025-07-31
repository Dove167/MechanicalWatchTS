import { BaseComponent } from '../abstract/BaseComponent';

export class CenterWheel extends BaseComponent {
    private _rotationSpeed: number;
    
    constructor(material: string = 'Brass') {
        super('Center Wheel', material);
        this._rotationSpeed = 1; // 1 revolution per hour
    }
    
    operate(): void {
        console.log(`${this.name} rotating at ${this._rotationSpeed} RPH`);
    }
}

export class ThirdWheel extends BaseComponent {
    private _gearRatio: number;
    
    constructor(material: string = 'Steel') {
        super('Third Wheel', material);
        this._gearRatio = 8; // 8:1 ratio
    }
    
    operate(): void {
        console.log(`${this.name} gear ratio: ${this._gearRatio}:1`);
    }
}

export class FourthWheel extends BaseComponent {
    private _rotationSpeed: number;
    
    constructor(material: string = 'Steel') {
        super('Fourth Wheel', material);
        this._rotationSpeed = 60; // 60 RPM
    }
    
    operate(): void {
        console.log(`${this.name} driving second hand at ${this._rotationSpeed} RPM`);
    }
}

export class EscapeWheel extends BaseComponent {
    private _teeth: number;
    
    constructor(material: string = 'Steel') {
        super('Escape Wheel', material);
        this._teeth = 15;
    }
    
    operate(): void {
        console.log(`${this.name} with ${this._teeth} teeth controlling escapement`);
    }
}