import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { ThemeProvider } from "./ThemeContext";  
import { LanguageProvider } from "./LanguageContext";  // ✅ Correct import

import WikiFeed from "./WikiFeed";
import WikiWebView from "./WikiWebView";
import SignInPage from "./SignInPage";
import SettingsScreen from "./SettingsScreen";
import BookmarksScreen from './BookmarksScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider> {/* ✅ ThemeProvider wraps everything */}
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="WikiFeed" component={WikiFeed} options={{ headerShown: false }} />
            <Stack.Screen name="WikiWebView" component={WikiWebView} options={{ title: "Article" }} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: "Settings" }} />
            <Stack.Screen name="BookmarksScreen" component={BookmarksScreen} options={{ title: "Bookmarks" }} />
            <Stack.Screen name="SignInPage" component={SignInPage} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
