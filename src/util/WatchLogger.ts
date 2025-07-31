import { WatchState, WatchComponent } from '../types/d.types';

export default class WatchLogger {
  /**
   * Logs application startup
   */
  public static logAppStart(): void {
    console.log(`\n🕰️ ═══════════════════════════════════════════════════════════════`);
    console.log('   MECHANICAL WATCH SIMULATOR v2.0');
    console.log('   Powered by TypeScript Engine');
    console.log(`═══════════════════════════════════════════════════════════════\n`);
  }

  /**
   * Logs watch events with timestamp
   */
  public static logWatchEvent(event: string, state: WatchState): void {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${event}`);
    console.log(`   Power Reserve: ${state.powerReserve.toFixed(1)}h`);
    console.log(`   Components Running: ${this.getRunningComponentsCount(state)}`);
    console.log(`   Beat Rate: ${state.beatRate} BPH\n`);
  }

  /**
   * Logs component-specific events
   */
  public static logComponentEvent(event: string, component: WatchComponent): void {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${event}`);
    console.log(`   Component: ${component.name}`);
    console.log(`   Status: ${component.status}`);
    console.log(`   Health: ${component.health.toFixed(1)}%\n`);
  }

  /**
   * Logs detailed component status
   */
  public static logComponentStatus(components: Map<string, WatchComponent>): void {
    console.log('⚙️ COMPONENT STATUS REPORT:');
    console.log('─'.repeat(50));
    
    components.forEach((component) => {
      const statusIcon = this.getStatusIcon(component.status);
      const healthBar = this.createTextHealthBar(component.health);
      
      console.log(`${statusIcon} ${component.name.padEnd(20)} ${healthBar} ${component.health.toFixed(1)}%`);
    });
    console.log('─'.repeat(50) + '\n');
  }

  /**
   * Logs movement analysis
   */
  public static logMovementAnalysis(state: WatchState): void {
    console.log('🔍 MOVEMENT ANALYSIS:');
    console.log('─'.repeat(40));
    console.log(`Beat Rate: ${state.beatRate.toLocaleString()} BPH`);
    console.log(`Accuracy: ${state.accuracy >= 0 ? '+' : ''}${state.accuracy.toFixed(1)} sec/day`);
    console.log(`Power Reserve: ${state.powerReserve.toFixed(1)} hours`);
    console.log(`Components: ${state.components.size} total`);
    console.log(`Running: ${this.getRunningComponentsCount(state)}`);
    console.log(`Needs Service: ${this.getNeedsServiceCount(state)}`);
    console.log('─'.repeat(40) + '\n');
  }

  /**
   * Exports watch data to JSON format
   */
  public static exportWatchData(state: WatchState): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      watchState: {
        isRunning: state.isRunning,
        currentTime: state.currentTime,
        powerReserve: state.powerReserve,
        beatRate: state.beatRate,
        accuracy: state.accuracy
      },
      components: Array.from(state.components.values()).map(component => ({
        id: component.id,
        name: component.name,
        type: component.type,
        status: component.status,
        health: component.health,
        rotationSpeed: component.rotationSpeed,
        position: component.position
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * General purpose logging
   */
  public static log(message: string): void {
    console.log(message);
  }

  // Helper methods
  private static getRunningComponentsCount(state: WatchState): number {
    return Array.from(state.components.values())
      .filter(c => c.status === 'running').length;
  }

  private static getNeedsServiceCount(state: WatchState): number {
    return Array.from(state.components.values())
      .filter(c => c.status === 'needs_service' || c.status === 'damaged').length;
  }

  private static getStatusIcon(status: string): string {
    switch (status) {
      case 'running': return '🟢';
      case 'stopped': return '🔴';
      case 'damaged': return '💥';
      case 'needs_service': return '⚠️';
      default: return '⚪';
    }
  }

  private static createTextHealthBar(health: number): string {
    const barLength = 10;
    const filledLength = Math.round((health / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    return `[${bar}]`;
  }
}