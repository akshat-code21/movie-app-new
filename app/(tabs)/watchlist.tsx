import { StyleSheet, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBookmarks } from '@/context/BookmarkContext';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function WatchlistScreen() {
  const { bookmarks, removeBookmark } = useBookmarks();

  const handleMoviePress = (movieId: string) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movieId }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Watchlist</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {bookmarks.length} {bookmarks.length === 1 ? 'movie' : 'movies'} saved
        </ThemedText>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {bookmarks.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <MaterialIcons name="bookmark-border" size={64} color="#888" />
            <ThemedText style={styles.emptyStateText}>
              Your watchlist is empty
            </ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>
              Movies you bookmark will appear here
            </ThemedText>
          </ThemedView>
        ) : (
          bookmarks.map(movie => (
            <TouchableOpacity 
              key={movie.id}
              style={styles.movieListItem}
              onPress={() => handleMoviePress(movie.id)}
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
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeBookmark(movie.id)}
              >
                <MaterialIcons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
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
    paddingTop: 20
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
  },
  content: {
    padding: 20,
    paddingTop: 10,
    gap: 16,
  },
  movieListItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
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
  removeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    gap: 16,
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