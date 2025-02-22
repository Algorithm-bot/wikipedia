import React, { useContext } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";  // ✅ Import Picker
import { useTheme } from "./ThemeContext";
import { LanguageContext } from "./LanguageContext";

const SettingsScreen = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage } = useContext(LanguageContext);  // ✅ Fixed useContext

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Text style={[styles.title, darkMode && styles.textDark]}>Settings</Text>

      {/* Dark Mode Toggle */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, darkMode && styles.textDark]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Language Picker */}
      <View style={[styles.languageSection, darkMode && { backgroundColor: '#242424' }]}>
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

      {/* Developer Contact Info */}
      <Text style={[styles.contact, darkMode && styles.textDark]}>Developer: Sahil</Text>
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

  languageSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
});

export default SettingsScreen;
