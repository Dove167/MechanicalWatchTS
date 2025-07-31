import { WatchState, WatchComponent, ComponentType } from '../types/d.types';

export default class WatchRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrame?: number;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.setupCanvas();
  }

  private setupCanvas(): void {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.ctx.imageSmoothingEnabled = true;
  }

  public renderWatch(state: WatchState): void {
    this.clearCanvas();
    
    // Render watch case
    this.renderWatchCase();
    
    // Render dial
    this.renderDial(state.currentTime);
    
    // Render movement (if visible)
    this.renderMovement(state);
    
    // Render hands
    this.renderHands(state.currentTime);
  }

  private renderWatchCase(): void {
    const centerX = 200;
    const centerY = 200;
    const radius = 180;

    // Outer case
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#e8e8e8');
    gradient.addColorStop(0.5, '#c0c0c0');
    gradient.addColorStop(1, '#a0a0a0');
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.strokeStyle = '#888';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    // Inner bezel
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius - 20, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#1a237e';
    this.ctx.fill();
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private renderDial(time: Date): void {
    const centerX = 200;
    const centerY = 200;
    
    // Hour markers
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x1 = centerX + Math.cos(angle) * 140;
      const y1 = centerY + Math.sin(angle) * 140;
      const x2 = centerX + Math.cos(angle) * 120;
      const y2 = centerY + Math.sin(angle) * 120;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    }

    // Brand text
    this.ctx.font = '14px serif';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PATEK PHILIPPE', centerX, centerY - 60);
    this.ctx.font = '10px serif';
    this.ctx.fillText('GENÈVE', centerX, centerY - 45);
  }

  private renderMovement(state: WatchState): void {
    const movementX = 500;
    const movementY = 200;
    
    // Movement plate
    this.ctx.beginPath();
    this.ctx.arc(movementX, movementY, 150, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fill();
    this.ctx.strokeStyle = '#555';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Render each component
    state.components.forEach((component) => {
      this.renderComponent(component, movementX, movementY);
    });
  }

  private renderComponent(component: WatchComponent, offsetX: number, offsetY: number): void {
    const x = offsetX + component.position.x - 200;
    const y = offsetY + component.position.y - 200;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(component.position.rotation * Math.PI / 180);

    // Component-specific rendering
    switch (component.type) {
      case ComponentType.BALANCE_WHEEL:
        this.renderBalanceWheel(component);
        break;
      case ComponentType.ESCAPE_WHEEL:
        this.renderEscapeWheel(component);
        break;
      case ComponentType.MAINSPRING:
        this.renderMainspring(component);
        break;
      default:
        this.renderGenericWheel(component);
    }

    this.ctx.restore();
  }

  private renderBalanceWheel(component: WatchComponent): void {
    // Balance wheel rim
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 25, 0, 2 * Math.PI);
    this.ctx.strokeStyle = component.status === 'running' ? '#00ffff' : '#666';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Balance wheel spokes
    for (let i = 0; i < 4; i++) {
      const angle = i * Math.PI / 2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(Math.cos(angle) * 20, Math.sin(angle) * 20);
      this.ctx.stroke();
    }
    
    // Center
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 3, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fill();
  }

  private renderEscapeWheel(component: WatchComponent): void {
    const teeth = 15;
    this.ctx.beginPath();
    
    for (let i = 0; i < teeth; i++) {
      const angle = (i * 360 / teeth) * Math.PI / 180;
      const x = Math.cos(angle) * 12;
      const y = Math.sin(angle) * 12;
      
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    
    this.ctx.closePath();
    this.ctx.strokeStyle = component.status === 'running' ? '#ffff00' : '#666';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private renderMainspring(component: WatchComponent): void {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 20, 0, 2 * Math.PI);
    this.ctx.fillStyle = component.status === 'running' ? '#ff6b6b' : '#444';
    this.ctx.fill();
    this.ctx.strokeStyle = '#888';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private renderGenericWheel(component: WatchComponent): void {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    this.ctx.fillStyle = component.status === 'running' ? '#888' : '#444';
    this.ctx.fill();
    this.ctx.strokeStyle = '#aaa';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  private renderHands(time: Date): void {
    const centerX = 200;
    const centerY = 200;
    
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    
    // Hour hand
    const hourAngle = (hours * 30 + minutes * 0.5 - 90) * Math.PI / 180;
    this.renderHand(centerX, centerY, hourAngle, 60, 6, '#ffffff');
    
    // Minute hand
    const minuteAngle = (minutes * 6 - 90) * Math.PI / 180;
    this.renderHand(centerX, centerY, minuteAngle, 90, 4, '#ffffff');
    
    // Second hand
    const secondAngle = (seconds * 6 - 90) * Math.PI / 180;
    this.renderHand(centerX, centerY, secondAngle, 100, 2, '#ff4444');
  }

  private renderHand(centerX: number, centerY: number, angle: number, length: number, width: number, color: string): void {
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(
      centerX + Math.cos(angle) * length,
      centerY + Math.sin(angle) * length
    );
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.stroke();
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public startAnimation(state: WatchState): void {
    const animate = () => {
      this.renderWatch(state);
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  public stopAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}