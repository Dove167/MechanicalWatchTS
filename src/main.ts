import WatchApp from './WatchApp';
import WatchLogger from './util/WatchLogger';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🕰️ Initializing Mechanical Watch Simulator...');
  
  // Log application start
  WatchLogger.logAppStart();
  
  const app = new WatchApp();
  app.start();
  
  // Global error handling
  window.addEventListener('error', (event) => {
    console.error('Application Error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
  });
});