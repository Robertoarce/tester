# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React Native Expo app for discovering places in Paris, France using Google Places API. The app features photo-first place cards, search functionality, quick filters, and detailed place information with similar place recommendations.

## Tech Stack

- **React Native** (0.74.5) with **Expo** (~51.0.0)
- **TypeScript** for type safety
- **React Navigation** (Native Stack Navigator)
- **Axios** for HTTP requests
- **Google Places API** for place data and photos
- **react-native-dotenv** for environment variable management

## Development Commands

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

### Platform-Specific Launch
```bash
npm run android  # Android emulator/device
npm run ios      # iOS simulator/device
npm run web      # Web browser
```

## Project Architecture

### Navigation Structure
The app uses a Native Stack Navigator with two main screens:
- `SearchScreen` - Main search interface with filters and results
- `PlaceDetailsScreen` - Detailed view of a selected place

Navigation is defined in `App.tsx` with type-safe params using `RootStackParamList`.

### API Service Layer (`services/googlePlaces.ts`)
Centralized Google Places API integration with functions:
- `searchPlaces()` - Text-based place search
- `getNearbyPlaces()` - Location-based nearby search with optional type filter
- `getPlaceDetails()` - Fetch full place details by place_id
- `getSimilarPlaces()` - Find similar places based on type and location
- `getPhotoUrl()` - Generate Google Places photo URLs

Default location is Paris: `{ lat: 48.8566, lng: 2.3522 }`

### Data Flow
1. User searches or filters → API call via service layer
2. Results stored in component state (useState)
3. Places rendered as `PlaceCard` components
4. Tap navigates to `PlaceDetailsScreen` passing place data
5. Details screen loads full information and similar places

### Component Structure

#### `PlaceCard` Component
Displays place with large photo, name, rating, price level, vicinity, and open/closed status. Photo overlays info at bottom for visual emphasis.

#### `SearchScreen`
- Search input with real-time query
- Quick filter chips (restaurants, cafés, bars, attractions, museums)
- FlatList of place results
- Loads nearby places on mount

#### `PlaceDetailsScreen`
- Hero photo with back button overlay
- Photo gallery (horizontal scroll)
- Ratings, reviews, categories
- Action buttons: Directions, Call, Website
- Similar places section (horizontal scroll)

### Environment Configuration

API key stored in `.env`:
```
GOOGLE_API_KEY=your_api_key_here
```

TypeScript types defined in `env.d.ts` for `@env` module.

### Google Places API Requirements

Ensure these APIs are enabled in Google Cloud Console:
- Places API
- Places API (New)
- Maps JavaScript API

## Key Files

- `App.tsx` - Navigation container and stack configuration
- `services/googlePlaces.ts` - Google Places API service layer (lines 10-91)
- `types/place.ts` - TypeScript interfaces for Place and PlaceDetails
- `components/PlaceCard.tsx` - Reusable place card component
- `screens/SearchScreen.tsx` - Main search interface (lines 35-54 for API calls)
- `screens/PlaceDetailsScreen.tsx` - Place details view (lines 34-44 for data loading)

## Important Notes

- All API calls are async with try-catch error handling
- Photos use `getPhotoUrl()` helper with configurable maxWidth
- Navigation uses type-safe params (RootStackParamList)
- Place objects include geometry, photos, rating, types, opening_hours
- Similar places filtered to exclude current place by place_id comparison
