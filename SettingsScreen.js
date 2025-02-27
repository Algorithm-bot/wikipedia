import React, { useContext, createContext, useState } from "react";
import { 
  View, 
  Text, 
  Switch, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  Modal,
  ScrollView,
  Pressable,
  Image,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";  // ✅ Import Picker
import { useTheme } from "./ThemeContext";
import { LanguageContext } from "./LanguageContext";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./firebaseConfig";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "History", value: "History" },
  { label: "Science", value: "Science" },
  { label: "Arts", value: "Arts" },
  { label: "Sports", value: "Sports" },
  { label: "Technology", value: "Technology" },
  { label: "Geography", value: "Geography" },
  { label: "Literature", value: "Literature" },
  { label: "Politics", value: "Politics" },
  { label: "Music", value: "Music" },
  { label: "Movies", value: "Films" },
  { label: "Nature", value: "Nature" },
  { label: "Space", value: "Space" },
  { label: "Medicine", value: "Medicine" },
];

const LANGUAGES = [
  { label: "English", value: "en", flag: "🇺🇸" },
  { label: "Hindi", value: "hi", flag: "🇮🇳" },
  { label: "Spanish", value: "es", flag: "🇪🇸" },
  { label: "French", value: "fr", flag: "🇫🇷" },
  { label: "German", value: "de", flag: "🇩🇪" },
  { label: "Italian", value: "it", flag: "🇮🇹" },
  { label: "Japanese", value: "ja", flag: "🇯🇵" },
  { label: "Korean", value: "ko", flag: "🇰🇷" },
  { label: "Russian", value: "ru", flag: "🇷🇺" },
  { label: "Chinese", value: "zh", flag: "🇨🇳" },
  { label: "Portuguese", value: "pt", flag: "🇵🇹" },
  { label: "Arabic", value: "ar", flag: "🇸🇦" },
  { label: "Dutch", value: "nl", flag: "🇳🇱" },
  { label: "Polish", value: "pl", flag: "🇵🇱" },
  { label: "Turkish", value: "tr", flag: "🇹🇷" },
];

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  return (
    <PreferencesContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </PreferencesContext.Provider>
  );
};

const SettingsScreen = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage } = useContext(LanguageContext);
  const { selectedCategory, setSelectedCategory } = useContext(PreferencesContext);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const navigation = useNavigation();

  const selectedLanguage = LANGUAGES.find(lang => lang.value === language) || LANGUAGES[0];
  const selectedCategoryLabel = CATEGORIES.find(cat => cat.value === selectedCategory)?.label || "All";

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignInPage' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, darkMode && { backgroundColor: '#121212' }]}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? "#1a1a1a" : "#ffffff"}
      />
      <View style={[styles.container, darkMode && { backgroundColor: '#121212' }]}>
        {/* Light Mode Toggle */}
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, darkMode && styles.textDark]}>Light Mode</Text>
          <Switch 
            value={!darkMode} 
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={!darkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        {/* Language Selection */}
        <View style={[styles.settingSection, darkMode && { backgroundColor: '#242424' }]}>
          <Text style={[styles.label, darkMode && styles.textDark]}>Select Language:</Text>
          <TouchableOpacity 
            style={[styles.selector, darkMode && styles.selectorDark]}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Text style={[styles.selectorText, darkMode && styles.textDark]}>
              {selectedLanguage.flag} {selectedLanguage.label}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={languageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, darkMode && styles.modalViewDark]}>
              <Text style={[styles.modalTitle, darkMode && styles.textDark]}>
                Select Language
              </Text>
              <ScrollView style={styles.list}>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.value}
                    style={[
                      styles.listItem,
                      language === lang.value && styles.selectedItem,
                      darkMode && styles.listItemDark
                    ]}
                    onPress={() => {
                      setLanguage(lang.value);
                      setLanguageModalVisible(false);
                    }}
                  >
                    <Text style={styles.flagText}>{lang.flag}</Text>
                    <Text style={[
                      styles.listItemText,
                      language === lang.value && styles.selectedItemText,
                      darkMode && styles.textDark
                    ]}>
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.closeButton, darkMode && styles.closeButtonDark]}
                onPress={() => setLanguageModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Category Preferences */}
        <View style={[styles.settingSection, darkMode && { backgroundColor: '#242424' }]}>
          <Text style={[styles.label, darkMode && styles.textDark]}>Content Preferences:</Text>
          <TouchableOpacity 
            style={[styles.categorySelector, darkMode && styles.categorySelectorDark]}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={[styles.categoryText, darkMode && styles.textDark]}>
              {selectedCategoryLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={categoryModalVisible}
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, darkMode && styles.modalViewDark]}>
              <Text style={[styles.modalTitle, darkMode && styles.textDark]}>
                Select Category
              </Text>
              <ScrollView style={styles.categoryList}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryItem,
                      selectedCategory === category.value && styles.selectedCategory,
                      darkMode && styles.categoryItemDark
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.value);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.categoryItemText,
                      selectedCategory === category.value && styles.selectedCategoryText,
                      darkMode && styles.textDark
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.closeButton, darkMode && styles.closeButtonDark]}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Developer Contact Info */}
        <Text style={[styles.contact, darkMode && styles.textDark]}>
          Developer: sahilsawant929@gmail.com
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  containerDark: { 
    backgroundColor: "#121212" 
  },

  title: { 
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 32,
    color: "#333",
    letterSpacing: 0.5,
  },
  
  settingRow: { 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  settingText: { 
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  logoutButton: { 
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutText: { 
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  contact: { 
    marginTop: 32,
    fontSize: 16,
    color: "#666",
    textAlign: 'center',
    fontWeight: '500',
  },

  label: { 
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600",
    color: "#333",
  },
  
  picker: { 
    height: 50,
    width: '100%',
    color: '#333',
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  
  pickerDark: {
    color: '#fff',
    backgroundColor: '#242424',
  },

  textDark: { 
    color: "#FFF" 
  },

  settingSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginBottom: 16,
  },

  categorySelector: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  categorySelectorDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalViewDark: {
    backgroundColor: '#242424',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryList: {
    width: '100%',
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItemDark: {
    borderBottomColor: '#333',
  },
  selectedCategory: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonDark: {
    backgroundColor: '#1565C0',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selector: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  selectorDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemDark: {
    borderBottomColor: '#333',
  },
  flagText: {
    fontSize: 24,
    marginRight: 12,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItem: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  selectedItemText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
