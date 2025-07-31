import { WatchCase, Crystal, Crown, Dial } from './components/ExternalComponents';
import { HourHand, MinuteHand, SecondHand } from './components/Hands';
import { Mainspring, BalanceWheel, Escapement } from './components/Movement';
import { CenterWheel, ThirdWheel, FourthWheel, EscapeWheel } from './components/GearTrain';
import { Jewel } from './components/Jewels';
import { Regulator } from './components/Regulator';
import { PowerReserveIndicator } from './components/PowerReserve';
import { ShockProtection } from './components/ShockProtection';
import { WatchComponent } from './interfaces/WatchComponent';

export class MechanicalWatch {
    private _components: WatchComponent[];
    private _hands: { hour: HourHand; minute: MinuteHand; second: SecondHand };
    private _movement: { mainspring: Mainspring; balanceWheel: BalanceWheel; escapement: Escapement };
    private _isRunning: boolean;
    private _gearTrain: {
        centerWheel: CenterWheel;
        thirdWheel: ThirdWheel;
        fourthWheel: FourthWheel;
        escapeWheel: EscapeWheel;
    };
    private _jewels: Jewel[];
    private _regulator: Regulator;
    private _powerReserve: PowerReserveIndicator;
    private _shockProtection: ShockProtection;

    constructor() {
        // External components
        const watchCase = new WatchCase('Stainless Steel', 40);
        const crystal = new Crystal('Sapphire', 98);
        const crown = new Crown('Gold');
        const dial = new Dial('Enamel', 'White', true);

        // Hands
        this._hands = {
            hour: new HourHand('Gold'),
            minute: new MinuteHand('Gold'),
            second: new SecondHand('Red Steel')
        };

        // Movement
        this._movement = {
            mainspring: new Mainspring('Blue Steel'),
            balanceWheel: new BalanceWheel('Brass'),
            escapement: new Escapement('Ruby')
        };

        // Gear train
        this._gearTrain = {
            centerWheel: new CenterWheel(),
            thirdWheel: new ThirdWheel(),
            fourthWheel: new FourthWheel(),
            escapeWheel: new EscapeWheel()
        };

        // Jewels (typical positions in a mechanical watch)
        this._jewels = [
            new Jewel('Balance Upper'),
            new Jewel('Balance Lower'),
            new Jewel('Escape Wheel Upper'),
            new Jewel('Escape Wheel Lower'),
            new Jewel('Fourth Wheel Upper'),
            new Jewel('Fourth Wheel Lower'),
            new Jewel('Third Wheel Upper'),
            new Jewel('Third Wheel Lower'),
            new Jewel('Center Wheel'),
            new Jewel('Mainspring Barrel'),
            new Jewel('Pallet Fork Upper'),
            new Jewel('Pallet Fork Lower'),
            new Jewel('Escape Wheel Impulse'),
            new Jewel('Fourth Wheel Impulse'),
            new Jewel('Third Wheel Impulse')
        ];

        this._regulator = new Regulator();
        this._powerReserve = new PowerReserveIndicator();
        this._shockProtection = new ShockProtection();

        // All components
        this._components = [
            watchCase, crystal, crown, dial,
            this._hands.hour, this._hands.minute, this._hands.second,
            this._movement.mainspring, this._movement.balanceWheel, this._movement.escapement,
            ...Object.values(this._gearTrain),
            ...this._jewels,
            this._regulator,
            this._powerReserve,
            this._shockProtection
        ];

        this._isRunning = false;
    }

    start(): void {
        this._isRunning = true;
        console.log('⏰ Watch started!');
    }

    stop(): void {
        this._isRunning = false;
        console.log('⏰ Watch stopped!');
    }

    tick(): void {
        if (!this._isRunning) return;

        // Check if mainspring has power
        if (!this._movement.mainspring.isWorking) {
            this.stop();
            return;
        }

        // Operate all components
        this._movement.mainspring.operate();
        this._movement.balanceWheel.operate();
        this._movement.escapement.operate();

        // Operate gear train
        Object.values(this._gearTrain).forEach(gear => gear.operate());
        
        // Operate jewels
        this._jewels.forEach(jewel => jewel.operate());
        
        // Update power reserve
        this._powerReserve.updateReserve(this._movement.mainspring.tension);
        
        // Operate other components
        this._regulator.operate();
        this._powerReserve.operate();
        this._shockProtection.operate();

        // Move hands
        this._hands.second.move();
        if (this._hands.second.angle === 0) { // Every minute
            this._hands.minute.move();
            if (this._hands.minute.angle === 0) { // Every hour
                this._hands.hour.move();
            }
        }
    }

    windWatch(): void {
        this._movement.mainspring.wind();
    }

    getStatus(): { time: string; components: string[]; isRunning: boolean; jewelCount: number; powerReserve: number } {
        const currentTime = this._movement.balanceWheel.getCurrentTime();
        return {
            time: currentTime.toLocaleTimeString(),
            components: this._components.map(c => c.getStatus()),
            isRunning: this._isRunning,
            jewelCount: this.getJewelCount(),
            powerReserve: this.getPowerReserve()
        };
    }

    get components(): WatchComponent[] {
        return [...this._components];
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    // New methods
    regulateWatch(direction: 'faster' | 'slower'): void {
        this._regulator.adjustRegulation(direction);
    }

    simulateShock(force: number): void {
        this._shockProtection.receiveShock(force);
    }

    getJewelCount(): number {
        return this._jewels.filter(j => j.isWorking).length;
    }

    getPowerReserve(): number {
        return this._powerReserve.hoursRemaining;
    }
}
