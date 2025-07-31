import { WatchState, WatchComponent, ComponentStatus } from './types/d.types';
import WatchRenderer from './renderer/WatchRenderer';

export default class WatchApp {
  private _renderer: WatchRenderer | null = null;
  private _isMovementVisible: boolean = false;
  private _selectedComponent: string | null = null;
  private _socket: any;

  constructor() {
    // Initialize renderer if we're in a browser environment
    if (typeof document !== 'undefined') {
      this._renderer = new WatchRenderer('watch-canvas');
      this.setupEventListeners();
      this.setupSocket();
    }
  }

  private setupSocket(): void {
    // Connect to Socket.IO server
    this._socket = io();
    
    // Listen for watch status updates
    this._socket.on('watchStatus', (state: WatchState) => {
      this.updateUI(state);
      if (this._renderer) {
        this._renderer.renderWatch(state);
      }
    });
  }

  private setupEventListeners(): void {
    // Control buttons
    this.setupButton('start-btn', () => this.startWatch());
    this.setupButton('stop-btn', () => this.stopWatch());
    this.setupButton('wind-btn', () => this.windWatch());
    this.setupButton('shock-btn', () => this.shockTest());
    this.setupButton('movement-toggle', () => this.toggleMovementView());
    this.setupButton('service-btn', () => this.serviceWatch());
    this.setupButton('reset-btn', () => this.resetWatch());
    this.setupButton('export-btn', () => this.exportData());

    // Component selection
    this.setupComponentSelection();
  }

  private setupButton(id: string, handler: () => void): void {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', handler);
    }
  }

  private setupComponentSelection(): void {
    const componentList = document.getElementById('component-list');
    if (!componentList) return;

    componentList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('component-item')) {
        const componentId = target.dataset.componentId;
        this.selectComponent(componentId || null);
      }
    });
  }

  private async startWatch(): Promise<void> {
    try {
      const response = await fetch('/api/start', { method: 'POST' });
      const result = await response.json();
      if (!result.success) {
        this.showAlert('⚠️ Failed to start watch');
      }
    } catch (error) {
      console.error('Error starting watch:', error);
      this.showAlert('⚠️ Error starting watch');
    }
  }

  private async stopWatch(): Promise<void> {
    try {
      const response = await fetch('/api/stop', { method: 'POST' });
      const result = await response.json();
      if (!result.success) {
        this.showAlert('⚠️ Failed to stop watch');
      }
    } catch (error) {
      console.error('Error stopping watch:', error);
      this.showAlert('⚠️ Error stopping watch');
    }
  }

  private async windWatch(): Promise<void> {
    try {
      const response = await fetch('/api/wind', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        this.showAlert('🔄 Watch wound successfully');
      } else {
        this.showAlert('⚠️ Failed to wind watch');
      }
    } catch (error) {
      console.error('Error winding watch:', error);
      this.showAlert('⚠️ Error winding watch');
    }
  }

  private async shockTest(): Promise<void> {
    if (confirm('⚠️ This will simulate a shock to the movement. Continue?')) {
      try {
        const response = await fetch('/api/shock', { method: 'POST' });
        const result = await response.json();
        if (!result.success) {
          this.showAlert('⚠️ Failed to simulate shock');
        }
      } catch (error) {
        console.error('Error simulating shock:', error);
        this.showAlert('⚠️ Error simulating shock');
      }
    }
  }

  private toggleMovementView(): void {
    this._isMovementVisible = !this._isMovementVisible;
    const movementPanel = document.getElementById('movement-panel');
    const toggleBtn = document.getElementById('movement-toggle');
    
    if (movementPanel && toggleBtn) {
      if (this._isMovementVisible) {
        movementPanel.classList.remove('hidden');
        toggleBtn.textContent = '👁️ Hide Movement';
      } else {
        movementPanel.classList.add('hidden');
        toggleBtn.textContent = '⚙️ Show Movement';
      }
    }
  }

  private async serviceWatch(): Promise<void> {
    if (confirm('🔧 This will service all components. Continue?')) {
      try {
        const response = await fetch('/api/service', { method: 'POST' });
        const result = await response.json();
        if (result.success) {
          this.showAlert('🔧 Watch serviced successfully');
        } else {
          this.showAlert('⚠️ Failed to service watch');
        }
      } catch (error) {
        console.error('Error servicing watch:', error);
        this.showAlert('⚠️ Error servicing watch');
      }
    }
  }

  private async resetWatch(): Promise<void> {
    if (confirm('🔄 This will reset the watch to factory settings. Continue?')) {
      try {
        const response = await fetch('/api/reset', { method: 'POST' });
        const result = await response.json();
        if (result.success) {
          this.showAlert('🔄 Watch reset to factory settings');
        } else {
          this.showAlert('⚠️ Failed to reset watch');
        }
      } catch (error) {
        console.error('Error resetting watch:', error);
        this.showAlert('⚠️ Error resetting watch');
      }
    }
  }

  private selectComponent(componentId: string | null): void {
    this._selectedComponent = componentId;
    this.updateComponentDetails();
    
    // Update visual selection
    document.querySelectorAll('.component-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    if (componentId) {
      const selectedItem = document.querySelector(`[data-component-id="${componentId}"]`);
      if (selectedItem) {
        selectedItem.classList.add('selected');
      }
    }
  }

  private updateUI(state: WatchState): void {
    this.updateStatusDisplay(state);
    this.updateComponentList(state);
    this.updateTimeDisplay(state);
    this.updatePowerDisplay(state);
    this.updateMovementSpecs(state);
    this.updateStats(state);
  }

  private updateStatusDisplay(state: WatchState): void {
    const statusElement = document.getElementById('watch-status');
    if (statusElement) {
      statusElement.textContent = state.isRunning ? '🟢 Running' : '🔴 Stopped';
      statusElement.className = `status ${state.isRunning ? 'running' : 'stopped'}`;
    }
  }

  private updateComponentList(state: WatchState): void {
    const componentList = document.getElementById('component-list');
    if (!componentList) return;

    componentList.innerHTML = '';
    
    state.components.forEach((component) => {
      const item = document.createElement('div');
      item.className = `component-item ${component.status}`;
      item.dataset.componentId = component.id;
      
      const healthBar = this.createHealthBar(component.health);
      const statusIcon = this.getStatusIcon(component.status);
      
      item.innerHTML = `
        <div class="component-info">
          <span class="component-name">${component.name}</span>
          <span class="component-status">${statusIcon} ${component.status}</span>
        </div>
        <div class="component-health">
          ${healthBar}
          <span class="health-value">${component.health.toFixed(1)}%</span>
        </div>
      `;
      
      componentList.appendChild(item);
    });
  }

  private createHealthBar(health: number): string {
    const percentage = Math.max(0, Math.min(100, health));
    const color = health > 80 ? '#00ff00' : health > 50 ? '#ffff00' : '#ff4444';
    
    return `
      <div class="health-bar">
        <div class="health-fill" style="width: ${percentage}%; background-color: ${color}"></div>
      </div>
    `;
  }

  private getStatusIcon(status: ComponentStatus): string {
    switch (status) {
      case ComponentStatus.RUNNING:
        return '🟢';
      case ComponentStatus.STOPPED:
        return '🔴';
      case ComponentStatus.DAMAGED:
        return '💥';
      case ComponentStatus.NEEDS_SERVICE:
        return '⚠️';
      default:
        return '⚪';
    }
  }

  private updateTimeDisplay(state: WatchState): void {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
      timeElement.textContent = new Date(state.currentTime).toLocaleTimeString();
    }
  }

  private updatePowerDisplay(state: WatchState): void {
    const powerElement = document.getElementById('power-reserve');
    if (powerElement) {
      const hours = Math.floor(state.powerReserve);
      const minutes = Math.floor((state.powerReserve - hours) * 60);
      powerElement.textContent = `${hours}h ${minutes}m`;
    }

    const powerBar = document.getElementById('power-bar');
    if (powerBar) {
      const percentage = (state.powerReserve / 42) * 100;
      powerBar.style.width = `${percentage}%`;
      
      if (percentage > 50) {
        powerBar.className = 'power-bar high';
      } else if (percentage > 20) {
        powerBar.className = 'power-bar medium';
      } else {
        powerBar.className = 'power-bar low';
      }
    }
  }

  private updateMovementSpecs(state: WatchState): void {
    const beatRateElement = document.getElementById('beat-rate');
    if (beatRateElement) {
      beatRateElement.textContent = `${state.beatRate.toLocaleString()} BPH`;
    }

    const accuracyElement = document.getElementById('accuracy');
    if (accuracyElement) {
      const sign = state.accuracy >= 0 ? '+' : '';
      accuracyElement.textContent = `${sign}${state.accuracy.toFixed(1)} sec/day`;
    }
  }

  private updateStats(state: WatchState): void {
    // Update component count
    const componentCountElement = document.getElementById('component-count');
    if (componentCountElement) {
      const totalComponents = state.components.size;
      const runningComponents = Array.from(state.components.values())
        .filter(c => c.status === ComponentStatus.RUNNING).length;
      componentCountElement.textContent = `${runningComponents}/${totalComponents}`;
    }

    // Update average health
    const avgHealthElement = document.getElementById('avg-health');
    if (avgHealthElement) {
      const avgHealth = Array.from(state.components.values())
        .reduce((sum, component) => sum + component.health, 0) / state.components.size;
      avgHealthElement.textContent = `${avgHealth.toFixed(1)}%`;
    }

    // Update efficiency (simplified calculation)
    const efficiencyElement = document.getElementById('efficiency');
    if (efficiencyElement) {
      const efficiency = state.isRunning ?
        Math.min(100, 90 + (state.powerReserve / 42) * 10) : 0;
      efficiencyElement.textContent = `${efficiency.toFixed(1)}%`;
    }
  }

  private updateComponentDetails(): void {
    const detailsPanel = document.getElementById('component-details');
    if (!detailsPanel || !this._selectedComponent) {
      if (detailsPanel) detailsPanel.innerHTML = '<p>Select a component to view details</p>';
      return;
    }

    // In a real implementation, you would fetch detailed component data from the server
    // For now, we'll just show a message
    detailsPanel.innerHTML = `<p>Details for component: ${this._selectedComponent}</p>`;
  }

  private exportData(): void {
    this.showAlert('📤 Export functionality not implemented yet');
  }

  private showAlert(message: string): void {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.textContent = message;
    
    alertContainer.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.classList.add('fade-out');
      setTimeout(() => {
        if (alertDiv.parentNode === alertContainer) {
          alertContainer.removeChild(alertDiv);
        }
      }, 300);
    }, 3000);
  }

  public start(): void {
    console.log('🕰️ Mechanical Watch Simulator Started');
  }
}