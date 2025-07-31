# Mechanical Watch Simulator

This application is a digital simulation of a mechanical watch, built using TypeScript and Node.js with the Express.js framework. It demonstrates object-oriented programming (OOP) principles to model the intricate components and behaviors of a traditional mechanical timepiece.

## Features

- **Realistic Component Simulation**: Models various parts of a mechanical watch, including:
    - **External Components**: Watch Case, Crystal, Crown, Dial.
    - **Hands**: Hour, Minute, and Second hands that move realistically.
    - **Movement Components**: Mainspring (power source), Balance Wheel (timekeeping), and Escapement (energy regulation).
    - **Gear Train**: Center Wheel, Third Wheel, Fourth Wheel, and Escape Wheel for power transmission.
    - **Jewels/Bearings**: Simulate friction reduction and wear.
    - **Regulator System**: Allows adjustment of watch accuracy (faster/slower).
    - **Power Reserve Indicator**: Displays remaining power in hours.
    - **Shock Protection**: Simulates resistance to impacts.
- **Interactive Web Interface**: A simple web interface (powered by EJS) allows users to:
    - View the current simulated time on a **Patek Philippe-inspired watch face**.
    - See the operational status of the watch (running/stopped).
    - Monitor the status of individual watch components.
    - Control the watch: Start, Stop, Wind the mainspring, manually advance time by a "tick".
    - **New Controls**: Adjust regulation (faster/slower) and simulate shock impacts.
    - **New Displays**: View current jewel count and power reserve.
- **Visual Enhancements**:
    - **Animated Watch Face**: A Patek Philippe-inspired design with moving hands and a date window.
    - **Animated Movement Display**: Visualizes the internal gears, balance wheel, and jewels in motion.
    - **Animated Power Reserve**: A dynamic gauge showing remaining power.
- **Real-time Updates (Socket.IO)**: The interface updates dynamically without full page refreshes, providing a smooth user experience.
- **Comprehensive Statistics Page**: A dedicated page (`/stats`) providing detailed insights into:
    - Movement data and timing performance.
    - Power system status (power reserve, mainspring tension).
    - Component health (jewel condition, gear train status).
    - Environmental data (temperature, humidity, magnetic field, shock resistance).
    - Service information (last/next service, oil condition, wear level).
    - Interactive charts for power reserve over time and timing accuracy.
- **Object-Oriented Design**: The application leverages OOP concepts such as:
    - **Abstraction**: `BaseComponent` hides the complexity of individual components, exposing only essential interfaces.
    - **Encapsulation**: Each component manages its own state and behavior.
    - **Inheritance**: Specific watch components (e.g., `WatchCase`, `HourHand`, `Mainspring`) inherit common properties and methods from `BaseComponent` or `Hand`.
    - **Polymorphism**: Components adhere to interfaces like `WatchComponent`, `Moveable`, and `Timekeeping`, allowing them to be treated uniformly.

## Technologies Used

- **TypeScript**: For type-safe and scalable code.
- **Node.js**: The runtime environment for the server.
- **Express.js**: Web framework for handling routes and serving the web interface.
- **EJS**: Embedded JavaScript templating for dynamic HTML generation.
- **Socket.IO**: For real-time, bidirectional communication between the server and client.

## Application Structure

The core logic resides in the `src/` directory, organized as follows:

- [`src/MechanicalWatch.ts`](src/MechanicalWatch.ts): The main class that orchestrates the entire watch simulation, composing all individual components.
- [`src/abstract/BaseComponent.ts`](src/abstract/BaseComponent.ts): An abstract base class for all watch components, defining common properties and abstract methods.
- [`src/interfaces/WatchComponent.ts`](src/interfaces/WatchComponent.ts): Defines TypeScript interfaces for `WatchComponent`, `Moveable`, and `Timekeeping`, ensuring consistent behavior across different component types.
- [`src/components/ExternalComponents.ts`](src/components/ExternalComponents.ts): Classes representing the external parts of the watch (Case, Crystal, Crown, Dial).
- [`src/components/Hands.ts`](src/components/Hands.ts): Classes for the Hour, Minute, and Second hands, including their movement logic.
- [`src/components/Movement.ts`](src/components/Movement.ts): Classes simulating the internal movement mechanisms (Mainspring, Balance Wheel, Escapement).
- [`src/components/GearTrain.ts`](src/components/GearTrain.ts): Classes for the gear train components (Center Wheel, Third Wheel, Fourth Wheel, Escape Wheel).
- [`src/components/Jewels.ts`](src/components/Jewels.ts): Class for simulating jewels/bearings and their wear.
- [`src/components/Regulator.ts`](src/components/Regulator.ts): Class for the regulator system, allowing time adjustment.
- [`src/components/PowerReserve.ts`](src/components/PowerReserve.ts): Class for the power reserve indicator.
- [`src/components/ShockProtection.ts`](src/components/ShockProtection.ts): Class for simulating shock protection.
- [`src/server.ts`](src/server.ts): The Express.js server setup, handling web requests and integrating with the `MechanicalWatch` instance.
- [`views/watch.ejs`](views/watch.ejs): The EJS template for the main watch display.
- [`views/stats.ejs`](views/stats.ejs): The EJS template for the statistics page.
- [`public/css/style.css`](public/css/style.css): Base external stylesheet for the web interface.
- [`public/css/watch-face.css`](public/css/watch-face.css): Styling for the Patek Philippe-inspired watch face.
- [`public/css/movement-display.css`](public/css/movement-display.css): Styling for the internal movement visualization.
- [`public/css/gears.css`](public/css/gears.css): Styling for animated gears.
- [`public/css/jewels.css`](public/css/jewels.css): Styling for animated jewels.
- [`public/css/balance-wheel.css`](public/css/balance-wheel.css): Styling for balance wheel animation.
- [`public/css/power-reserve.css`](public/css/power-reserve.css): Styling for the power reserve indicator.

## How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Build the TypeScript Project**:
    ```bash
    npm run build
    ```
3.  **Start the Server**:
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:3000`.

This project provides a clear and interactive demonstration of how complex real-world systems can be modeled and simulated using object-oriented principles in a modern web environment.

## How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
    
2.  **Start the Server**:
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:3000`.

This project provides a clear and interactive demonstration of how complex real-world systems can be modeled and simulated using object-oriented principles in a modern web environment.