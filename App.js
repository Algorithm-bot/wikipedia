import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-get-random-values';
import { ThemeProvider } from "./ThemeContext";  
import { LanguageProvider } from "./LanguageContext";  
import { PreferencesProvider } from './SettingsScreen';
import { View, ActivityIndicator } from 'react-native';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import WikiFeed from "./WikiFeed";
import WikiWebView from "./WikiWebView";
import SignInPage from "./SignInPage";
import SettingsScreen from "./SettingsScreen";
import BookmarksScreen from './BookmarksScreen';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChangedHandler(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedHandler);
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <PreferencesProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {!user ? (
                <Stack.Screen 
                  name="SignInPage" 
                  component={SignInPage} 
                  options={{ headerShown: false }} 
                />
              ) : (
                <>
                  <Stack.Screen 
                    name="WikiFeed" 
                    component={WikiFeed} 
                    options={{ headerShown: false }}
                    initialParams={{ uid: user.uid }}
                  />
                  <Stack.Screen name="WikiWebView" component={WikiWebView} options={{ title: "Article" }} />
                  <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: "Settings" }} />
                  <Stack.Screen name="BookmarksScreen" component={BookmarksScreen} options={{ title: "Bookmarks" }} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
