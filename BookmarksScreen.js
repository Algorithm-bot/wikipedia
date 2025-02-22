import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useTheme } from './ThemeContext';

const BACKEND_URL = "http://192.168.0.100:5000";

const BookmarksScreen = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { darkMode } = useTheme();

  const fetchBookmarks = async () => {
    try {
      console.log("Fetching bookmarks from:", `${BACKEND_URL}/favorites`);
      const response = await axios.get(`${BACKEND_URL}/favorites`);
      console.log("Received bookmarks:", response.data);
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      Alert.alert(
        "Error",
        "Failed to load bookmarks. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const removeBookmark = async (pageid) => {
    try {
      await axios.delete(`${BACKEND_URL}/favorites/${pageid}`);
      setBookmarks(prev => prev.filter(bookmark => bookmark.pageid !== pageid));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      Alert.alert("Error", "Failed to remove bookmark. Please try again.");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBookmarks();
  }, []);

  // Initial load
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Refresh on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookmarks();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, darkMode && styles.containerDark]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Text style={[styles.header, darkMode && styles.textDark]}>Bookmarks</Text>
      
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.pageid.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]}
            tintColor={darkMode ? "#fff" : "#2196F3"}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, darkMode && styles.textDark]}>
              No bookmarks yet. Save some articles from the feed!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.articleContainer, darkMode && styles.articleContainerDark]}>
            {item.thumbnail && (
              <Image 
                source={{ uri: item.thumbnail }} 
                style={styles.image}
                defaultSource={require('./assets/icon.png')} // Add a placeholder image
              />
            )}
            
            <View style={styles.contentContainer}>
              <Text style={[styles.title, darkMode && styles.textDark]}>
                {item.title}
              </Text>
              <Text style={[styles.extract, darkMode && styles.textDark]} numberOfLines={3}>
                {item.extract}
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={() => navigation.navigate('WikiWebView', { url: item.url })}
                >
                  <Text style={styles.readMoreText}>Read More</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeBookmark(item.pageid)}
                >
                  <MaterialCommunityIcons 
                    name="bookmark" 
                    size={27} 
                    color="#FF6B6B" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
    color: '#333',
    letterSpacing: 0.5,
  },
  articleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  articleContainerDark: {
    backgroundColor: '#242424',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  extract: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readMoreButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  readMoreText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
    borderRadius: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  textDark: {
    color: '#fff',
  },
});

export default BookmarksScreen; 