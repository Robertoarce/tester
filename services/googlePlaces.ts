import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';
import { Place, PlaceDetails } from '../types/place';

const GOOGLE_PLACES_API = 'https://maps.googleapis.com/maps/api/place';

// Default location: Paris, France
export const PARIS_LOCATION = {
  lat: 48.8566,
  lng: 2.3522,
};

export const searchPlaces = async (
  query: string,
  location = PARIS_LOCATION,
  radius = 5000
): Promise<Place[]> => {
  try {
    const response = await axios.get(`${GOOGLE_PLACES_API}/textsearch/json`, {
      params: {
        query,
        location: `${location.lat},${location.lng}`,
        radius,
        key: GOOGLE_API_KEY,
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};

export const getNearbyPlaces = async (
  location = PARIS_LOCATION,
  radius = 2000,
  type?: string
): Promise<Place[]> => {
  try {
    const response = await axios.get(`${GOOGLE_PLACES_API}/nearbysearch/json`, {
      params: {
        location: `${location.lat},${location.lng}`,
        radius,
        type: type || 'restaurant|cafe|bar|tourist_attraction',
        key: GOOGLE_API_KEY,
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};

export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  try {
    const response = await axios.get(`${GOOGLE_PLACES_API}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,formatted_phone_number,formatted_address,opening_hours,website,reviews,photos,geometry,types,price_level,user_ratings_total',
        key: GOOGLE_API_KEY,
      },
    });

    return response.data.result || null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export const getPhotoUrl = (photoReference: string, maxWidth = 400): string => {
  return `${GOOGLE_PLACES_API}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
};

export const getSimilarPlaces = async (place: Place): Promise<Place[]> => {
  try {
    // Get places of similar type nearby
    const type = place.types?.[0] || 'restaurant';
    const response = await axios.get(`${GOOGLE_PLACES_API}/nearbysearch/json`, {
      params: {
        location: `${place.geometry.location.lat},${place.geometry.location.lng}`,
        radius: 3000,
        type,
        key: GOOGLE_API_KEY,
      },
    });

    // Filter out the current place
    return (response.data.results || []).filter(
      (p: Place) => p.place_id !== place.place_id
    );
  } catch (error) {
    console.error('Error fetching similar places:', error);
    return [];
  }
};
