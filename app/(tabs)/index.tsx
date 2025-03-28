import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

interface Movie {
  id?: string;
  title: string;
  Poster: string;
  rating: number;
  year: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const popularSearchTerm = "comedy";
  const recentSearchTerm = "2024";
  
  const [popularPage, setPopularPage] = useState(1);
  const [recentPage, setRecentPage] = useState(1);
  
  const API_KEY = '6525d202'; 

  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        const popular = await fetchMoviesBySearch(popularSearchTerm, 1);
        const recent = await fetchMoviesBySearch(recentSearchTerm, 1);
        
        setPopularMovies(popular);
        setRecentMovies(recent);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMovies();
  }, []);


  const fetchMoviesBySearch = async (searchTerm: string, page: number) => {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}&type=movie`
    );
    const data = await response.json();
    
    if (data.Response === "True" && data.Search) {
      const moviesWithDetails = await Promise.all(
        data.Search.map(async (item: any) => {
          const detailResponse = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`
          );
          const detailData = await detailResponse.json();
          
          return {
            id: item.imdbID,
            title: item.Title,
            Poster: item.Poster,
            rating: parseFloat(detailData.imdbRating) || 0,
            year: item.Year
          };
        })
      );
      
      return moviesWithDetails;
    }
    
    return [];
  };

  const loadMoreMovies = async (type: 'popular' | 'recent') => {
    setLoadingMore(true);
    try {
      let newMovies: Movie[] = [];
      
      if (type === 'popular') {
        const nextPage = popularPage + 1;
        newMovies = await fetchMoviesBySearch(popularSearchTerm, nextPage);
        setPopularPage(nextPage);
        setPopularMovies([...popularMovies, ...newMovies]);
      } else {
        const nextPage = recentPage + 1;
        newMovies = await fetchMoviesBySearch(recentSearchTerm, nextPage);
        setRecentPage(nextPage);
        setRecentMovies([...recentMovies, ...newMovies]);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleMoviePress = (movieId: string | undefined) => {
    if (movieId) {
      router.push({
        pathname: "/movie/[id]",
        params: { id: movieId }
      });
    }
  };

  const renderMovieCard = (movie: Movie) => (
    <TouchableOpacity 
      key={movie.id || movie.title} 
      style={styles.movieCard}
      onPress={() => handleMoviePress(movie.id)}
    >
      <View style={styles.moviePoster}>
        <Image 
          source={{ 
            uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225' 
          }}
          style={styles.posterImage}
        />
      </View>
      <ThemedText style={styles.movieTitle} numberOfLines={1}>{movie.title}</ThemedText>
      <ThemedText style={styles.movieRating}>⭐ {movie.rating.toFixed(1)}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type='title' style={styles.headerTitle}>MovieHub</ThemedText>
          <TouchableOpacity onPress={()=>{
            router.push('/explore')
          }}>
            <MaterialIcons 
              name="search" 
              size={28} 
              color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Now Playing</ThemedText>
          {loading ? (
            <ThemedText>Loading movies...</ThemedText>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recentMovies.map(renderMovieCard)}
              </ScrollView>
              <TouchableOpacity 
                style={styles.loadMoreButton}
                onPress={() => loadMoreMovies('recent')}
                disabled={loadingMore}
              >
                <ThemedText style={styles.loadMoreText}>
                  {loadingMore ? 'Loading...' : 'Load More'}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Popular</ThemedText>
          {loading ? (
            <ThemedText>Loading movies...</ThemedText>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {popularMovies.map(renderMovieCard)}
              </ScrollView>
              <TouchableOpacity 
                style={styles.loadMoreButton}
                onPress={() => loadMoreMovies('popular')}
                disabled={loadingMore}
              >
                <ThemedText style={styles.loadMoreText}>
                  {loadingMore ? 'Loading...' : 'Load More'}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    height : 50,
    overflow : "hidden",
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  movieCard: {
    width: 150,
    marginRight: 15,
  },
  moviePoster: {
    height: 225,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  movieRating: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  loadMoreButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
  },
  loadMoreText: {
    color: 'white',
    fontWeight: '600',
  },
});
