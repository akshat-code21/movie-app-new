import { StyleSheet, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import SearchBar from '@/components/ui/search-bar';
import { useState } from 'react';
import { router } from 'expo-router';

export interface Movie {
  title: string;
  Poster: string;
  rating: number;
  year: string;
  imdbID?: string;
}

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const [movie, setMovie] = useState<Movie | null>(null);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Search Movies</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Find your favorite movies and discover new ones
        </ThemedText>
      </View>

      <SearchBar movie={movie} setMovie={setMovie}/>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {movie ? (
          <TouchableOpacity 
            style={styles.movieListItem}
            onPress={() => {
              if (movie.imdbID) {
                router.push({
                  pathname: "/movie/[id]",
                  params: { id: movie.imdbID }
                });
              }
            }}
          >
            <Image 
              source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/100x150' }}
              style={styles.listPoster}
            />
            <View style={styles.movieInfo}>
              <ThemedText style={styles.movieTitle}>{movie.title}</ThemedText>
              <ThemedText style={styles.movieYear}>{movie.year}</ThemedText>
              <ThemedText style={styles.movieRating}>⭐ {movie.rating.toFixed(1)}</ThemedText>
            </View>
          </TouchableOpacity>
        ) : (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              Search for a movie to get started
            </ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>
              Try searching for "Inception" or "The Dark Knight"
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingTop : 20
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  movieListItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  listPoster: {
    width: 80,
    height: 120,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  movieYear: {
    fontSize: 14,
    opacity: 0.7,
  },
  movieRating: {
    fontSize: 14,
    opacity: 0.8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
