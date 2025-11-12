import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Place } from '../types/place';
import { PlaceCard } from '../components/PlaceCard';
import { searchPlaces, getNearbyPlaces, PARIS_LOCATION } from '../services/googlePlaces';

type RootStackParamList = {
  Search: undefined;
  PlaceDetails: { place: Place };
};

type SearchScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Search'>;
};

const QUICK_FILTERS = [
  { label: 'Restaurants', type: 'restaurant', icon: 'restaurant' },
  { label: 'Cafés', type: 'cafe', icon: 'cafe' },
  { label: 'Bars', type: 'bar', icon: 'beer' },
  { label: 'Attractions', type: 'tourist_attraction', icon: 'camera' },
  { label: 'Museums', type: 'museum', icon: 'color-palette' },
];

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Load nearby places on mount (Paris by default)
  useEffect(() => {
    loadNearbyPlaces();
  }, []);

  const loadNearbyPlaces = async (type?: string) => {
    setLoading(true);
    const results = await getNearbyPlaces(PARIS_LOCATION, 5000, type);
    setPlaces(results);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadNearbyPlaces(selectedFilter || undefined);
      return;
    }

    setLoading(true);
    const results = await searchPlaces(searchQuery, PARIS_LOCATION);
    setPlaces(results);
    setLoading(false);
  };

  const handleFilterPress = (type: string) => {
    const newFilter = selectedFilter === type ? null : type;
    setSelectedFilter(newFilter);

    if (searchQuery.trim()) {
      // If there's a search query, search with the filter
      handleSearch();
    } else {
      // Otherwise, load nearby places with filter
      loadNearbyPlaces(newFilter || undefined);
    }
  };

  const handlePlacePress = (place: Place) => {
    navigation.navigate('PlaceDetails', { place });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover Paris</Text>
        <Text style={styles.subtitle}>Find amazing places to go out</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for places..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              loadNearbyPlaces(selectedFilter || undefined);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={QUICK_FILTERS}
          keyExtractor={(item) => item.type}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === item.type && styles.filterChipActive,
              ]}
              onPress={() => handleFilterPress(item.type)}
            >
              <Ionicons
                name={item.icon as any}
                size={16}
                color={selectedFilter === item.type ? '#fff' : '#333'}
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item.type && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results Count */}
      {!loading && places.length > 0 && (
        <Text style={styles.resultsCount}>
          {places.length} place{places.length !== 1 ? 's' : ''} found
        </Text>
      )}

      {/* Places List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Finding amazing places...</Text>
        </View>
      ) : places.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="location-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No places found</Text>
          <Text style={styles.emptySubtext}>Try a different search or filter</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <PlaceCard place={item} onPress={() => handlePlacePress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  filterTextActive: {
    color: '#fff',
  },
  resultsCount: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
