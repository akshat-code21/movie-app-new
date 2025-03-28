import { Image, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { StyleSheet } from 'react-native';
import { Movie } from "@/app/(tabs)/explore";
import { router } from 'expo-router';

interface MovieCardProps {
    movie: Movie
}

export default function MovieCard({movie}: MovieCardProps) {
    const handlePress = () => {
        if (movie.imdbID) {
            router.push({
                pathname: "/movie/[id]",
                params: { id: movie.imdbID }
            });
        }
    };

    return(
        <TouchableOpacity onPress={handlePress}>
            <ThemedView>
                <Image source={{uri: movie.Poster}} style={styles.poster} />
                <ThemedView style={styles.infoContainer}>
                    <ThemedText style={styles.title} type='title'>{movie.title}</ThemedText>
                    <ThemedText style={styles.year}>{movie.year}</ThemedText>
                    <ThemedText style={styles.rating}> {movie.rating === 0 ? null : `⭐️ ${movie.rating}`} </ThemedText>
                </ThemedView>
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    poster: {
        width: 150,
        height: 225,
        borderRadius: 12,
        marginBottom: 10,
    },
    infoContainer: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    year: {
        fontSize: 16,
        opacity: 0.6,
    },
    rating: {
        fontSize: 16,
        opacity: 0.6,
    },
})