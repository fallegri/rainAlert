# Quick Start: Rain Alert App

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser with geolocation support

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rainAlert
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   # The database is automatically initialized on first run
   # Schema is defined in src/lib/schema.sql
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Allow geolocation permission when prompted

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Key Features

- **Location Detection**: Automatically detects your location
- **Zone Selection**: Choose weather zones to monitor
- **Prediction Calculation**: Get rain impact verdicts
- **Trajectory Animation**: Visualize storm movement
- **Analytics Logging**: Predictions are logged for improvement

## Configuration

- Weather API integration: Configure in environment variables
- Database path: Default is local SQLite file
- Geolocation timeout: Configurable in components

## Troubleshooting

- **Geolocation blocked**: Manually enter location coordinates
- **No weather zones**: Check database connection and fallback data
- **Animation not working**: Ensure Canvas API support in browser