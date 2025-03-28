import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BookmarkedMovie {
  id: string;
  title: string;
  Poster: string;
  rating: number;
  year: string;
}

interface BookmarkContextType {
  bookmarks: BookmarkedMovie[];
  addBookmark: (movie: BookmarkedMovie) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
});

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedMovie[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem('bookmarks');
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
  }, []);

  useEffect(() => {
    const saveBookmarks = async () => {
      try {
        await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Error saving bookmarks:', error);
      }
    };

    saveBookmarks();
  }, [bookmarks]);

  const addBookmark = (movie: BookmarkedMovie) => {
    setBookmarks((prev) => {
      if (prev.some((bookmark) => bookmark.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((bookmark) => bookmark.id === id);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}; 