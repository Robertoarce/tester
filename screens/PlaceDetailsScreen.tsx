import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Place, PlaceDetails } from '../types/place';
import { getPlaceDetails, getSimilarPlaces, getPhotoUrl } from '../services/googlePlaces';
import { PlaceCard } from '../components/PlaceCard';

type RootStackParamList = {
  Search: undefined;
  PlaceDetails: { place: Place };
};

type PlaceDetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PlaceDetails'>;
  route: RouteProp<RootStackParamList, 'PlaceDetails'>;
};

const { width } = Dimensions.get('window');

export const PlaceDetailsScreen: React.FC<PlaceDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { place: initialPlace } = route.params;
  const [place, setPlace] = useState<PlaceDetails>(initialPlace);
  const [similarPlaces, setSimilarPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaceDetails();
    loadSimilarPlaces();
  }, [initialPlace.place_id]);

  const loadPlaceDetails = async () => {
    const details = await getPlaceDetails(initialPlace.place_id);
    if (details) {
      setPlace(details);
    }
    setLoading(false);
  };

  const loadSimilarPlaces = async () => {
    const similar = await getSimilarPlaces(initialPlace);
    setSimilarPlaces(similar.slice(0, 5)); // Get top 5 similar places
  };

  const handlePhonePress = () => {
    if (place.formatted_phone_number) {
      Linking.openURL(`tel:${place.formatted_phone_number}`);
    }
  };

  const handleWebsitePress = () => {
    if (place.website) {
      Linking.openURL(place.website);
    }
  };

  const handleDirectionsPress = () => {
    const { lat, lng } = place.geometry.location;
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    );
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return 'Not available';
    return '€'.repeat(level);
  };

  const mainPhoto = place.photos?.[0]
    ? getPhotoUrl(place.photos[0].photo_reference, 800)
    : null;

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Photo */}
        {mainPhoto ? (
          <Image source={{ uri: mainPhoto }} style={styles.mainPhoto} resizeMode="cover" />
        ) : (
          <View style={[styles.mainPhoto, styles.noPhoto]}>
            <Ionicons name="image-outline" size={80} color="#ccc" />
          </View>
        )}

        {/* Photo Gallery */}
        {place.photos && place.photos.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoGallery}
            contentContainerStyle={styles.photoGalleryContent}
          >
            {place.photos.slice(1, 6).map((photo, index) => (
              <Image
                key={index}
                source={{ uri: getPhotoUrl(photo.photo_reference, 400) }}
                style={styles.galleryPhoto}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.content}>
          {/* Title and Rating */}
          <Text style={styles.name}>{place.name}</Text>

          {place.rating && (
            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.rating}>{place.rating.toFixed(1)}</Text>
                {place.user_ratings_total && (
                  <Text style={styles.ratingsCount}>({place.user_ratings_total} reviews)</Text>
                )}
              </View>

              {place.price_level && (
                <Text style={styles.priceLevel}>{getPriceLevel(place.price_level)}</Text>
              )}
            </View>
          )}

          {/* Status */}
          {place.opening_hours?.open_now !== undefined && (
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: place.opening_hours.open_now ? '#4CAF50' : '#F44336' },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: place.opening_hours.open_now ? '#4CAF50' : '#F44336' },
                ]}
              >
                {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          )}

          {/* Address */}
          {place.formatted_address && (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#007AFF" />
              <Text style={styles.infoText}>{place.formatted_address}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleDirectionsPress}>
              <Ionicons name="navigate" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Directions</Text>
            </TouchableOpacity>

            {place.formatted_phone_number && (
              <TouchableOpacity style={styles.actionButton} onPress={handlePhonePress}>
                <Ionicons name="call" size={24} color="#007AFF" />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
            )}

            {place.website && (
              <TouchableOpacity style={styles.actionButton} onPress={handleWebsitePress}>
                <Ionicons name="globe" size={24} color="#007AFF" />
                <Text style={styles.actionText}>Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Types/Categories */}
          {place.types && place.types.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.tagsContainer}>
                {place.types.slice(0, 5).map((type, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>
                      {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Reviews */}
          {place.reviews && place.reviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Reviews</Text>
              {place.reviews.slice(0, 3).map((review, index) => (
                <View key={index} style={styles.review}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                    <View style={styles.reviewRating}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewText} numberOfLines={3}>
                    {review.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Similar Places */}
          {similarPlaces.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Places Nearby</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarPlacesContent}
              >
                {similarPlaces.map((similarPlace) => (
                  <View key={similarPlace.place_id} style={styles.similarPlaceCard}>
                    <PlaceCard
                      place={similarPlace}
                      onPress={() => {
                        navigation.push('PlaceDetails', { place: similarPlace });
                      }}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mainPhoto: {
    width,
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  noPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoGallery: {
    marginTop: 12,
  },
  photoGalleryContent: {
    paddingHorizontal: 16,
  },
  galleryPhoto: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  ratingsCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  priceLevel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 6,
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  review: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  similarPlacesContent: {
    paddingRight: 16,
  },
  similarPlaceCard: {
    width: width - 64,
    marginRight: 0,
  },
});
