import { BaseComponent } from '../abstract/BaseComponent';

export class WatchCase extends BaseComponent {
    private _diameter: number;

    constructor(material: string, diameter: number) {
        super('Case', material);
        this._diameter = diameter;
    }

    operate(): void {
        console.log(`${this.name} is protecting the internal components`);
    }

    get diameter(): number { return this._diameter; }
}

export class Crystal extends BaseComponent {
    private _transparency: number;

    constructor(material: string = 'Sapphire', transparency: number = 95) {
        super('Crystal', material);
        this._transparency = transparency;
    }

    operate(): void {
        console.log(`${this.name} is providing ${this._transparency}% visibility`);
    }
}

export class Crown extends BaseComponent {
    private _position: 'pushed' | 'pulled';

    constructor(material: string = 'Steel') {
        super('Crown', material);
        this._position = 'pushed';
    }

    operate(): void {
        console.log(`${this.name} is in ${this._position} position`);
    }

    pull(): void {
        this._position = 'pulled';
        console.log('Crown pulled - ready to set time');
    }

    push(): void {
        this._position = 'pushed';
        console.log('Crown pushed - watch is sealed');
    }
}

export class Dial extends BaseComponent {
    private _color: string;
    private _hasNumbers: boolean;

    constructor(material: string = 'Metal', color: string = 'Black', hasNumbers: boolean = true) {
        super('Dial', material);
        this._color = color;
        this._hasNumbers = hasNumbers;
    }

    operate(): void {
        console.log(`${this.name} displaying ${this._color} face with ${this._hasNumbers ? 'numbers' : 'markers'}`);
    }
}
