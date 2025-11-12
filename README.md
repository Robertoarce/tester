# Places Search App

A React Native Expo app for discovering places to go out in Paris, France. Search for restaurants, cafés, bars, attractions, and more using Google Places API with beautiful photo-first displays.

## Features

- 🔍 **Smart Search**: Search for any type of place with real-time results
- 📸 **Photo-First Design**: Beautiful cards showing place photos prominently
- 🏷️ **Quick Filters**: Filter by restaurants, cafés, bars, attractions, and museums
- 📍 **Location-Based**: Centered on Paris, France by default
- ⭐ **Ratings & Reviews**: View ratings, reviews, and opening hours
- 🗺️ **Detailed Information**: Full place details with photos, contact info, and directions
- 🎯 **Similar Places**: Discover similar nearby locations
- 📱 **Native Features**: Call, navigate, or visit website directly from the app

## Setup

### Prerequisites

- Node.js (v14 or later)
- Expo CLI
- Google Maps Platform API Key with Places API enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd places-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Google API key:
   - Your API key should already be in the `.env` file as `GOOGLE_API_KEY`
   - Ensure the following APIs are enabled in Google Cloud Console:
     - Places API
     - Places API (New)
     - Maps JavaScript API

### Running the App

Start the development server:
```bash
npm start
```

Run on specific platform:
```bash
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run on web browser
```

## Project Structure

```
/
├── components/          # Reusable components
│   └── PlaceCard.tsx   # Place card with photo and info
├── screens/            # App screens
│   ├── SearchScreen.tsx        # Main search screen
│   └── PlaceDetailsScreen.tsx  # Place details screen
├── services/           # API services
│   └── googlePlaces.ts # Google Places API integration
├── types/              # TypeScript types
│   └── place.ts        # Place-related types
├── App.tsx             # Main app with navigation
├── .env                # Environment variables (Google API key)
└── package.json        # Dependencies and scripts
```

## Key Features Explained

### Search Screen
- Default location: Paris, France (48.8566°N, 2.3522°E)
- Quick filter chips for common place types
- Search by name, category, or keyword
- Results display with large photos

### Place Details
- Photo gallery with multiple images
- Ratings, reviews, and price level
- Direct actions: Call, Navigate, Visit Website
- Similar nearby places recommendations
- Open/Closed status indicator

### Google Places Integration
- Text search for flexible queries
- Nearby search for location-based results
- Place details with full information
- Place photos with optimized URLs
- Similar places suggestions

## Technologies Used

- **React Native** (0.74.5) - Mobile framework
- **Expo** (~51.0.0) - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Axios** - HTTP requests
- **Google Places API** - Place data and photos
- **Expo Vector Icons** - Icons

## API Usage

The app uses Google Places API for:
- Searching places by text query
- Finding nearby places by location and type
- Fetching detailed place information
- Retrieving place photos
- Discovering similar places

Ensure your API key has sufficient quota for production use.

## License

MIT
