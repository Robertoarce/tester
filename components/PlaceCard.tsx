import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '../types/place';
import { getPhotoUrl } from '../services/googlePlaces';

interface PlaceCardProps {
  place: Place;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onPress }) => {
  const photoUrl = place.photos?.[0]
    ? getPhotoUrl(place.photos[0].photo_reference, 800)
    : null;

  const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '€'.repeat(level);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Photo - Large and prominent */}
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.photo} resizeMode="cover" />
      ) : (
        <View style={[styles.photo, styles.noPhoto]}>
          <Ionicons name="image-outline" size={50} color="#ccc" />
        </View>
      )}

      {/* Info overlay at bottom of photo */}
      <View style={styles.infoOverlay}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>

        <View style={styles.metaRow}>
          {place.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{place.rating.toFixed(1)}</Text>
              {place.user_ratings_total && (
                <Text style={styles.ratingsCount}>({place.user_ratings_total})</Text>
              )}
            </View>
          )}

          {place.price_level && (
            <Text style={styles.priceLevel}>{getPriceLevel(place.price_level)}</Text>
          )}
        </View>

        {place.vicinity && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.vicinity} numberOfLines={1}>
              {place.vicinity}
            </Text>
          </View>
        )}

        {place.opening_hours?.open_now !== undefined && (
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: place.opening_hours.open_now ? '#4CAF50' : '#F44336' },
              ]}
            />
            <Text style={styles.statusText}>
              {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  photo: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  noPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  ratingsCount: {
    fontSize: 13,
    color: '#ddd',
    marginLeft: 4,
  },
  priceLevel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  vicinity: {
    fontSize: 13,
    color: '#ddd',
    marginLeft: 4,
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
});
