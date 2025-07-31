import { WatchState, WatchComponent, ComponentType, ComponentStatus, Position } from '../types/d.types';
import { EventEmitter } from 'events';

export default class WatchEngine extends EventEmitter {
  private _state: WatchState;
  private _tickInterval?: NodeJS.Timeout;
  private _powerDrainInterval?: NodeJS.Timeout;

  constructor() {
    super();
    this._state = this.initializeWatch();
  }

  private initializeWatch(): WatchState {
    const components = new Map<string, WatchComponent>();
    
    // Initialize all watch components with realistic specifications
    this.createComponent(components, 'mainspring', 'Mainspring Barrel', ComponentType.MAINSPRING, { x: 100, y: 200, rotation: 0 }, 0.5);
    this.createComponent(components, 'center_wheel', 'Center Wheel', ComponentType.CENTER_WHEEL, { x: 200, y: 200, rotation: 0 }, 1);
    this.createComponent(components, 'third_wheel', 'Third Wheel', ComponentType.THIRD_WHEEL, { x: 280, y: 150, rotation: 0 }, 8);
    this.createComponent(components, 'fourth_wheel', 'Fourth Wheel', ComponentType.FOURTH_WHEEL, { x: 300, y: 220, rotation: 0 }, 60);
    this.createComponent(components, 'escape_wheel', 'Escape Wheel', ComponentType.ESCAPE_WHEEL, { x: 150, y: 100, rotation: 0 }, 240);
    this.createComponent(components, 'balance_wheel', 'Balance Wheel', ComponentType.BALANCE_WHEEL, { x: 200, y: 80, rotation: 0 }, 28800);

    return {
      isRunning: false,
      currentTime: new Date(),
      powerReserve: 42, // hours
      components,
      beatRate: 28800, // beats per hour
      accuracy: 0 // perfect initially
    };
  }

  private createComponent(
    components: Map<string, WatchComponent>,
    id: string,
    name: string,
    type: ComponentType,
    position: Position,
    rotationSpeed: number
  ): void {
    components.set(id, {
      id,
      name,
      type,
      status: ComponentStatus.STOPPED,
      health: 95 + Math.random() * 5, // 95-100% health
      rotationSpeed,
      position,
      dependencies: this.getComponentDependencies(type)
    });
  }

  private getComponentDependencies(type: ComponentType): string[] {
    switch (type) {
      case ComponentType.CENTER_WHEEL:
        return ['mainspring'];
      case ComponentType.THIRD_WHEEL:
        return ['center_wheel'];
      case ComponentType.FOURTH_WHEEL:
        return ['third_wheel'];
      case ComponentType.ESCAPE_WHEEL:
        return ['fourth_wheel'];
      case ComponentType.BALANCE_WHEEL:
        return ['escape_wheel'];
      default:
        return [];
    }
  }

  public start(): void {
    if (this._state.isRunning) return;
    
    this._state.isRunning = true;
    this.updateComponentStatuses(ComponentStatus.RUNNING);
    
    // Start the main tick (4Hz = 250ms intervals)
    this._tickInterval = setInterval(() => {
      this.tick();
    }, 250);

    // Power drain simulation (every minute)
    this._powerDrainInterval = setInterval(() => {
      this.drainPower();
    }, 60000);

    this.emit('watchStarted', this._state);
  }

  public stop(): void {
    if (!this._state.isRunning) return;
    
    this._state.isRunning = false;
    this.updateComponentStatuses(ComponentStatus.STOPPED);
    
    if (this._tickInterval) {
      clearInterval(this._tickInterval);
      this._tickInterval = undefined;
    }
    
    if (this._powerDrainInterval) {
      clearInterval(this._powerDrainInterval);
      this._powerDrainInterval = undefined;
    }

    this.emit('watchStopped', this._state);
  }

  private tick(): void {
    // Update time
    this._state.currentTime = new Date();
    
    // Update component rotations
    this._state.components.forEach((component) => {
      if (component.status === ComponentStatus.RUNNING && component.rotationSpeed) {
        component.position.rotation += (component.rotationSpeed / 14400); // Convert to degrees per tick
      }
    });

    // Simulate mechanical wear
    this.simulateWear();
    
    this.emit('tick', this._state);
  }

  private drainPower(): void {
    if (this._state.powerReserve > 0) {
      this._state.powerReserve -= (1/60); // Drain 1 minute worth
      
      if (this._state.powerReserve <= 0) {
        this._state.powerReserve = 0;
        this.stop();
        this.emit('powerExhausted', this._state);
      }
    }
  }

  private simulateWear(): void {
    this._state.components.forEach((component) => {
      if (component.status === ComponentStatus.RUNNING) {
        // Very slow wear simulation
        component.health -= 0.0001;
        
        if (component.health < 70) {
          component.status = ComponentStatus.NEEDS_SERVICE;
        } else if (component.health < 30) {
          component.status = ComponentStatus.DAMAGED;
        }
      }
    });
  }

  public wind(): void {
    this._state.powerReserve = Math.min(42, this._state.powerReserve + 8);
    this.emit('wound', this._state);
  }

  public shock(): void {
    // Simulate shock damage
    const randomComponent = Array.from(this._state.components.values())[
      Math.floor(Math.random() * this._state.components.size)
    ];
    
    randomComponent.health -= Math.random() * 10;
    
    if (randomComponent.health < 50) {
      randomComponent.status = ComponentStatus.DAMAGED;
      this.stop();
    }
    
    this.emit('shocked', { component: randomComponent, state: this._state });
  }

  private updateComponentStatuses(status: ComponentStatus): void {
    this._state.components.forEach((component) => {
      if (component.health > 30) {
        component.status = status;
      }
    });
  }

  public get state(): WatchState {
    return { ...this._state };
  }

  public getComponent(id: string): WatchComponent | undefined {
    return this._state.components.get(id);
  }
}