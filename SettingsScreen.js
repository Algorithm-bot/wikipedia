import React, { useContext, createContext, useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";  // ✅ Import Picker
import { useTheme } from "./ThemeContext";
import { LanguageContext } from "./LanguageContext";

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

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>

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

      {/* Language Picker */}
      <View style={[styles.settingSection, darkMode && { backgroundColor: '#242424' }]}>
        <Text style={[styles.label, darkMode && styles.textDark]}>Select Language:</Text>
        <Picker
          selectedValue={language}
          onValueChange={(itemValue) => setLanguage(itemValue)}
          style={[styles.picker, darkMode && styles.pickerDark]}
          dropdownIconColor={darkMode ? "#fff" : "#000"}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Hindi" value="hi" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
          <Picker.Item label="German" value="de" />
          <Picker.Item label="Italian" value="it" />
          <Picker.Item label="Japanese" value="ja" />
          <Picker.Item label="Korean" value="ko" />
          <Picker.Item label="Russian" value="ru" />
          <Picker.Item label="Chinese" value="zh" />
        </Picker>
      </View>

      {/* Category Preferences */}
      <View style={[styles.settingSection, darkMode && { backgroundColor: '#242424' }]}>
        <Text style={[styles.label, darkMode && styles.textDark]}>Content Preferences:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={[styles.picker, darkMode && styles.pickerDark]}
          dropdownIconColor={darkMode ? "#fff" : "#000"}
        >
          {CATEGORIES.map((category) => (
            <Picker.Item 
              key={category.value}
              label={category.label} 
              value={category.value}
            />
          ))}
        </Picker>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Developer Contact Info */}
      <Text style={[styles.contact, darkMode && styles.textDark]}>Developer: sahilsawant929@gmail.com</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24,
    backgroundColor: "#fff",
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
});

export default SettingsScreen;
