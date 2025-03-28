import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useBookmarks } from "@/context/BookmarkContext";

interface MovieDetails {
    title: string;
    Poster: string;
    rating: number;
    year: string;
    plot: string;
    director: string;
    actors: string;
    genre: string;
    runtime: string;
    language: string;
}

export default function MovieScreen() {
    const { id } = useLocalSearchParams();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
    const movieId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
    const bookmarked = isBookmarked(movieId);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(
                    `https://www.omdbapi.com/?apikey=6525d202&i=${id}`
                );
                const data = await response.json();
                
                if (data.Response === "True") {
                    setMovie({
                        title: data.Title,
                        Poster: data.Poster,
                        rating: parseFloat(data.imdbRating) || 0,
                        year: data.Year,
                        plot: data.Plot,
                        director: data.Director,
                        actors: data.Actors,
                        genre: data.Genre,
                        runtime: data.Runtime,
                        language: data.Language
                    });
                }
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const toggleBookmark = () => {
        if (!movie) return;
        
        if (bookmarked) {
            removeBookmark(movieId);
        } else {
            addBookmark({
                id: movieId,
                title: movie.title,
                Poster: movie.Poster,
                rating: movie.rating,
                year: movie.year
            });
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ThemedText style={styles.loadingText}>Loading...</ThemedText>
            </ThemedView>
        );
    }

    if (!movie) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ThemedText style={styles.errorText}>Movie not found</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ThemedView style={styles.container}>
                <View style={styles.posterContainer}>
                    <Image 
                        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450' }}
                        style={styles.poster}
                    />
                    <TouchableOpacity 
                        style={styles.bookmarkButton}
                        onPress={toggleBookmark}
                    >
                        <MaterialIcons 
                            name={bookmarked ? "bookmark" : "bookmark-outline"} 
                            size={32} 
                            color={bookmarked ? "#E21221" : "white"} 
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={handleGoBack}
                    >
                        <MaterialIcons 
                            name="arrow-back" 
                            size={32} 
                            color="white" 
                        />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.details}>
                    <ThemedText style={styles.title}>{movie.title}</ThemedText>
                    
                    <View style={styles.metaInfo}>
                        <ThemedText style={styles.rating}>⭐ {movie.rating.toFixed(1)}</ThemedText>
                        <ThemedText style={styles.dot}>•</ThemedText>
                        <ThemedText style={styles.year}>{movie.year}</ThemedText>
                        <ThemedText style={styles.dot}>•</ThemedText>
                        <ThemedText style={styles.runtime}>{movie.runtime}</ThemedText>
                    </View>

                    <View style={styles.genreContainer}>
                        {movie.genre.split(', ').map((genre, index) => (
                            <View key={index} style={styles.genreTag}>
                                <ThemedText style={styles.genreText}>{genre}</ThemedText>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Plot</ThemedText>
                        <ThemedText style={styles.plot}>{movie.plot}</ThemedText>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Director</ThemedText>
                        <ThemedText style={styles.director}>{movie.director}</ThemedText>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Cast</ThemedText>
                        <ThemedText style={styles.actors}>{movie.actors}</ThemedText>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Language</ThemedText>
                        <ThemedText style={styles.language}>{movie.language}</ThemedText>
                    </View>
                </View>
            </ThemedView>
        </ScrollView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    posterContainer: {
        position: 'relative',
    },
    poster: {
        width: width - 32,
        height: (width - 32) * 1.5,
        resizeMode: 'cover',
        borderRadius: 16,
        marginBottom: 20,
    },
    bookmarkButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    details: {
        gap: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 34,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rating: {
        fontSize: 16,
        fontWeight: '600',
    },
    dot: {
        fontSize: 16,
        opacity: 0.5,
    },
    year: {
        fontSize: 16,
        opacity: 0.8,
    },
    runtime: {
        fontSize: 16,
        opacity: 0.8,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    genreTag: {
        backgroundColor: '#rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    genreText: {
        fontSize: 14,
        opacity: 0.9,
    },
    section: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        opacity: 0.9,
    },
    plot: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.8,
    },
    director: {
        fontSize: 16,
        opacity: 0.8,
    },
    actors: {
        fontSize: 16,
        opacity: 0.8,
        lineHeight: 24,
    },
    language: {
        fontSize: 16,
        opacity: 0.8,
    },
});