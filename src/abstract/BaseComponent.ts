import { WatchComponent } from '../interfaces/WatchComponent';

export abstract class BaseComponent implements WatchComponent {
    protected _name: string;
    protected _material: string;
    protected _isWorking: boolean;

    constructor(name: string, material: string) {
        this._name = name;
        this._material = material;
        this._isWorking = true;
    }

    // Getters (Encapsulation)
    get name(): string { return this._name; }
    get material(): string { return this._material; }
    get isWorking(): boolean { return this._isWorking; }

    // Abstract method (must be implemented by subclasses)
    abstract operate(): void;

    getStatus(): string {
        return `${this._name} (${this._material}): ${this._isWorking ? 'Working' : 'Broken'}`;
    }

    protected setWorking(status: boolean): void {
        this._isWorking = status;
    }
}
