import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const WIKI_API_URL = "https://en.wikipedia.org/api/rest_v1/page/random/summary";

// Predefined tags for filtering
const tags = ["#science", "#history", "#technology", "#art", "#sports"]; 

// Function to classify the tags for an article's content
const getClassifiedTags = async (articleContent) => {
  try {
    const response = await axios.post('http://192.168.0.100/classify', {
      content: articleContent,
    });
    return response.data.tags;  // Assuming response returns classified tags
  } catch (error) {
    console.error('Error fetching classified tags:', error);
    return [];
  }
};

const WikiFeed = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(""); // Store selected tag
  const navigation = useNavigation();

  // Fetch article summary and classify tags
  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(WIKI_API_URL);
      const data = await response.json();

      // Classify tags for the article using the server
      const tagsForArticle = await getClassifiedTags(data.extract);

      // Add the classified tags to the article
      const articleWithTags = {
        ...data,
        tags: tagsForArticle, // Add classified tags here
      };

      setArticles((prev) => [...prev, articleWithTags]);
      setFilteredArticles((prev) => [...prev, articleWithTags]); // Initially, show all articles
    } catch (error) {
      console.error("Error fetching Wikipedia article:", error);
    }
    setLoading(false);
  };

  // Filter articles based on the selected tag
  const filterArticlesByTag = async (tag) => {
    setSelectedTag(tag);

    if (tag === "") {
      setFilteredArticles(articles); // Show all articles if no tag is selected
    } else {
      const filtered = [];

      // Filter articles based on classified tags
      for (let article of articles) {
        const articleTags = await getClassifiedTags(article.extract);
        if (articleTags.includes(tag)) {
          filtered.push(article);
        }
      }

      setFilteredArticles(filtered);
    }
  };

  useEffect(() => {
    fetchArticle(); // Fetch the first article on mount
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Tag Filter Section */}
      <View style={styles.tagContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by tag (e.g., science)"
          value={selectedTag.replace("#", "")} // Display without '#'
          onChangeText={(text) => filterArticlesByTag(`#${text}`)} // Apply tag filter
        />
      </View>

      {/* Tag List Section */}
      <View style={styles.tags}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tagButton, selectedTag === tag && styles.selectedTag]}
            onPress={() => filterArticlesByTag(tag)} // Filter by tag
          >
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Articles List */}
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.pageid.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 16, alignItems: "center" }}>
            {item.thumbnail?.source && (
              <Image
                source={{ uri: item.thumbnail.source }}
                style={{ width: 300, height: 200, borderRadius: 10 }}
                resizeMode="cover"
              />
            )}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>{item.title}</Text>
            <Text style={{ fontSize: 16, textAlign: "center", marginVertical: 10 }}>
              {item.extract.length > 200 ? item.extract.substring(0, 200) + "..." : item.extract}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("WikiWebView", { url: `https://en.wikipedia.org/wiki/${item.title.replace(/ /g, "_")}` })}
              style={{ backgroundColor: "#007AFF", padding: 10, borderRadius: 8 }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Read More</Text>
            </TouchableOpacity>
          </View>
        )}
        onEndReached={fetchArticle} // Load more articles on scroll
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#007AFF" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    padding: 10,
    backgroundColor: "#f1f1f1",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  tagButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  selectedTag: {
    backgroundColor: "#005BB5",
  },
  tagText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default WikiFeed;
