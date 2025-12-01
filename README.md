# Weather App

A modern, responsive Single Page Application (SPA) built with Next.js, React, and TypeScript that displays weather information for selected cities. The app uses the OpenWeatherMap API to fetch real-time weather data and hourly forecasts.

## Features

- **City Management**: Add and remove cities from your weather list
- **Weather Cards**: View brief weather information for each city in a card layout
- **Detailed View**: Click on any city card to see detailed weather information
- **Real-time Updates**: Refresh weather data for individual cities or all cities at once
- **Hourly Forecast Chart**: View 24-hour temperature forecast on the detailed city page
- **Local Storage**: All cities are persisted in localStorage and automatically restored on page reload
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Modern UI**: Beautiful gradient design with smooth animations and transitions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with persistence middleware
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: SCSS Modules
- **UI Components**: Material UI Icons
- **Charts**: Recharts
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js 18+ and npm/yarn
- OpenWeatherMap API key (free tier available at [openweathermap.org](https://openweathermap.org/api))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/All1in/weather-app.git
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
.env.local
```

4. Add your OpenWeatherMap API key to `.env.local`:
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Project Structure

```
weather-app/
├── app/                    # Next.js app directory
│   ├── city/[id]/         # Dynamic route for city details
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # React Query provider
├── components/            # React components
│   ├── AddCityForm/      # Form to add new cities
│   ├── CityCard/         # City weather card component
│   ├── CityDetails/      # Detailed city view
│   ├── CityList/         # List of city cards
│   └── ErrorMessage/     # Error display component
├── lib/                  # Utility functions
│   ├── weather-api.ts    # OpenWeatherMap API client
│   └── storage.ts        # LocalStorage helpers
├── store/                # Zustand store
│   └── useCityStore.ts   # City management store
├── styles/               # Global styles
│   └── globals.scss      # Global SCSS
└── types/                # TypeScript types
    └── weather.ts        # Weather data types
```

## Usage

### Adding a City

1. Enter a city name in the input field (e.g., "Kyiv", "London", "New York")
2. Click "Add City" or press Enter
3. The app will fetch current weather data and display it in a card

### Viewing City Details

1. Click on any city card
2. You'll see detailed weather information including:
   - Current temperature and conditions
   - Feels like temperature
   - Min/Max temperatures
   - Humidity, pressure, wind speed
   - Visibility, sunrise, and sunset times
   - 24-hour temperature forecast chart

### Refreshing Weather Data

- **Single City**: Click the "Refresh" button on any city card
- **All Cities**: Weather data is automatically refreshed when you reload the page

### Removing a City

1. Click the delete icon (trash) in the top-right corner of any city card
2. Confirm the deletion

## Testing

The project includes comprehensive tests for:
- Component rendering and interactions
- Store state management
- Form submissions
- Error handling

Run tests with:
```bash
npm test
```

## Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Usage

This app uses the OpenWeatherMap API:
- **Current Weather API**: For real-time weather data
- **5 Day / 3 Hour Forecast API**: For hourly forecast charts

Make sure to respect the API rate limits on the free tier (60 calls/minute).

## Author

Built with ❤️ using Next.js and React
