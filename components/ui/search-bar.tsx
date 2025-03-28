import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Platform, useColorScheme, TouchableOpacity } from 'react-native';
import { Movie } from '@/app/(tabs)/explore';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
    movie: Movie | null;
    setMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
}

const SearchBar = ({ movie, setMovie }: SearchBarProps) => {
    const [text, setText] = useState(movie?.title || '');

    const fetchMovie = async () => {
        try {
            if (!text.trim()) {
                console.log('Please enter a movie title');
                return;
            }

            const response = await fetch(`https://www.omdbapi.com/?apikey=6525d202&t=${encodeURIComponent(text)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            if (data.Response === "Please enter a movie title") {
                alert(`Movie not found: ${data.Error}`);
            } else {
                setMovie({
                    title: data.Title,
                    Poster: data.Poster,
                    rating: parseFloat(data.imdbRating) || 0,
                    year: data.Year,
                    imdbID: data.imdbID
                });
            }
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    }

    const clearText = () => {
        setText('');
        setMovie(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setText}
                    value={text}
                    placeholder="Enter movie title"
                    placeholderTextColor="#888888"
                    keyboardType="default"
                    autoCorrect={true}
                    autoCapitalize="sentences"
                />
                {text.length > 0 && (
                    <TouchableOpacity onPress={clearText} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#888888" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Search"
                    onPress={() => fetchMovie()}
                    color={Platform.OS === 'ios' ? '#007AFF' : '#2196F3'}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: "transparent",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "90%"
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#444444',
        borderWidth: 1,
        borderRadius: 8,
        marginRight: 10,
    },
    input: {
        height: 30,
        paddingHorizontal: 15,
        color: "#FFFFFF",
        flex: 1,
        fontSize: 16,
        borderWidth: 0,
    },
    clearButton: {
        padding: 8,
    },
    buttonContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
});

export default SearchBar;