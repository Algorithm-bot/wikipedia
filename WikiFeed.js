import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"; // Heart & Settings icon
import { LanguageContext } from "./LanguageContext";
import { useTheme } from "./ThemeContext";
import { PreferencesContext } from './SettingsScreen';

const BACKEND_URL = "https://wikipedia-backend-v2yn.onrender.com"; // Update with your backend IP

const WikiFeed = () => {
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { language } = useContext(LanguageContext);
  const { darkMode } = useTheme();
  const { selectedCategory } = useContext(PreferencesContext);
  const { uid } = route.params; // Receive uid from navigation params

  // Fetch a random Wikipedia article
  const getWikiApiUrl = () => {
    if (selectedCategory === 'all') {
      return `https://${language}.wikipedia.org/api/rest_v1/page/random/summary`;
    }
    
    // Use interwiki search for better language support
    return `https://${language}.wikipedia.org/w/api.php?` +
      new URLSearchParams({
        action: 'query',
        format: 'json',
        generator: 'search',
        gsrsearch: `incategory:${selectedCategory}`,
        gsrlimit: '10',
        prop: 'pageimages|extracts',
        piprop: 'thumbnail',
        pithumbsize: '300',
        exintro: '1',
        explaintext: '1',
        exlimit: 'max',
        origin: '*'
      });
  };

  const fetchArticle = async () => {
    setLoading(true);
    try {
      if (selectedCategory === 'all') {
        // Existing random article fetch logic
        const response = await fetch(getWikiApiUrl());
        const data = await response.json();
        const newArticle = {
          pageid: data.pageid,
          title: data.title,
          extract: data.extract,
          thumbnail: data.thumbnail?.source,
          url: `https://${language}.wikipedia.org/wiki/${data.title.replace(/ /g, "_")}`,
        };
        setArticles((prev) => [...prev, newArticle]);
      } else {
        // Modified category-specific fetch logic
        const response = await fetch(getWikiApiUrl());
        const data = await response.json();
        
        if (data.query && data.query.pages) {
          const pages = Object.values(data.query.pages);
          const articleDetails = pages.map(page => ({
            pageid: page.pageid,
            title: page.title,
            extract: page.extract || 'No description available',
            thumbnail: page.thumbnail?.source,
            url: `https://${language}.wikipedia.org/wiki/${page.title.replace(/ /g, "_")}`,
          }));

          setArticles(prev => [...prev, ...articleDetails]);
        } else {
          // If no results found, try fetching with English category names
          const enResponse = await fetch(
            `https://${language}.wikipedia.org/w/api.php?` +
            new URLSearchParams({
              action: 'query',
              format: 'json',
              generator: 'search',
              gsrsearch: `${selectedCategory}`,  // Search by category name directly
              gsrlimit: '10',
              prop: 'pageimages|extracts',
              piprop: 'thumbnail',
              pithumbsize: '300',
              exintro: '1',
              explaintext: '1',
              exlimit: 'max',
              origin: '*'
            })
          );
          
          const enData = await enResponse.json();
          if (enData.query && enData.query.pages) {
            const pages = Object.values(enData.query.pages);
            const articleDetails = pages.map(page => ({
              pageid: page.pageid,
              title: page.title,
              extract: page.extract || 'No description available',
              thumbnail: page.thumbnail?.source,
              url: `https://${language}.wikipedia.org/wiki/${page.title.replace(/ /g, "_")}`,
            }));

            setArticles(prev => [...prev, ...articleDetails]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching Wikipedia article:", error);
      Alert.alert("Error", "Failed to fetch articles. Please try again.");
    }
    setLoading(false);
  };

  // Fetch favorite articles
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/favorites`);
      setFavorites(response.data.map((fav) => fav.pageid));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Add an article to favorites
  const addToFavorites = async (article) => {
    try {
      console.log("Adding article to favorites:", article); // Debug log
      const response = await axios.post(`${BACKEND_URL}/favorites`, {
        user_id: uid, // Include uid in the payload
        ...article
      });
      if (response.data.article) {
        setFavorites((prev) => [...prev, article.pageid]);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error.response?.data?.message || error);
      Alert.alert("Error", "Failed to add article to bookmarks. Please try again.");
    }
  };

  // Remove an article from favorites
  const removeFromFavorites = async (pageid) => {
    try {
      await axios.delete(`${BACKEND_URL}/favorites/${pageid}`);
      setFavorites((prev) => prev.filter((id) => id !== pageid));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const searchArticles = async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      setArticles([]);
      fetchArticle();
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      // Using the opensearch API endpoint which is more reliable
      const response = await fetch(
        `https://${language}.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: 'opensearch',
          search: query,
          limit: '5',
          namespace: '0',
          format: 'json',
          origin: '*'
        })
      );
      
      const [searchTerm, titles, descriptions, urls] = await response.json();
      
      // Get detailed information for each search result
      const searchResults = await Promise.all(
        titles.map(async (title, index) => {
          const detailsResponse = await fetch(
            `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
          );
          const details = await detailsResponse.json();
          return {
            pageid: details.pageid,
            title: details.title,
            extract: details.extract || descriptions[index],
            thumbnail: details.thumbnail?.source,
            url: urls[index],
          };
        })
      );

      setArticles(searchResults);
    } catch (error) {
      console.error("Error searching articles:", error);
      Alert.alert("Error", "Failed to search articles. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setArticles([]);
    fetchArticle();
  }, [selectedCategory, language]);

  useEffect(() => {
    fetchFavorites(); // Load favorite articles
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchArticles(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  return (
    <SafeAreaView style={[styles.container, darkMode && { backgroundColor: '#121212' }]}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? "#1a1a1a" : "#ffffff"}
      />
      
      {/* Header with Search and Settings */}
      <View style={[styles.header, darkMode && styles.headerDark]}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, darkMode && styles.searchInputDark]}
            placeholder="Search articles..."
            placeholderTextColor={darkMode ? "#666" : "#999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => searchArticles(searchQuery)}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Feather name="x" size={20} color={darkMode ? "#666" : "#999"} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate("BookmarksScreen", { uid })}
        >
          <Feather name="bookmark" size={24} color={darkMode ? "white" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate("SettingsScreen")}
        >
          <Feather name="settings" size={24} color={darkMode ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      {/* Articles List */}
      <FlatList
        data={articles}
        keyExtractor={(item) => `${item.pageid}-${Date.now()}`}
        renderItem={({ item }) => (
          <View style={[styles.articleContainer, darkMode && styles.articleContainerDark]}>
            <View style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
            </View>

            <Text style={[styles.title, darkMode && styles.textDark]}>{item.title}</Text>
            <Text style={[styles.extract, darkMode && styles.textDark]}>
              {item.extract.length > 200 ? item.extract.substring(0, 200) + "..." : item.extract}
            </Text>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
              {/* Read More Button (Left Side) */}
              <TouchableOpacity
                onPress={() => navigation.navigate("WikiWebView", { url: item.url })}
                style={styles.readMoreButton}
              >
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>

              {/* Heart Button (Right Side) */}
              <View style={styles.bookmarkButtonContainer}>
                <TouchableOpacity
                  onPress={() =>
                    favorites.includes(item.pageid) ? removeFromFavorites(item.pageid) : addToFavorites(item)
                  }
                  style={styles.bookmarkButton}
                >
                  <MaterialCommunityIcons
                    name={favorites.includes(item.pageid) ? "bookmark" : "bookmark-outline"}
                    size={40}
                    color={favorites.includes(item.pageid) ? "#FF6B6B" : "rgba(37, 134, 239, 0.41)"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        onEndReached={!isSearching ? fetchArticle : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#2196F3" />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, darkMode && styles.textDark]}>
                {searchQuery.trim() 
                  ? "No articles found for your search"
                  : "Loading articles..."}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 16,
    backgroundColor: "#ffffff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerDark: {
    backgroundColor: '#1a1a1a',
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#333",
    letterSpacing: 0.5,
  },
  articleContainer: {
    padding: 20,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignItems: "center",
  },
  articleContainerDark: {
    backgroundColor: '#242424',
    shadowColor: "#fff",
    shadowOpacity: 0.1,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
    color: "#1a1a1a",
    paddingHorizontal: 10,
  },
  extract: {
    fontSize: 16,
    textAlign: "left",
    marginVertical: 12,
    color: "#555",
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  readMoreButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  readMoreText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  bookmarkButtonContainer: {
    position: 'relative',
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 20,
  },
  textDark: {
    color: '#ffffff',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(228, 216, 216, 0.11)',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  searchInputDark: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  clearButton: {
    padding: 4,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default WikiFeed;
