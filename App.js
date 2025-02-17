import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WikiFeed from "./WikiFeed";
import WikiWebView from "./WikiWebView";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="WikiFeed" component={WikiFeed} options={{ title: "WikiFeed" }} />
        <Stack.Screen name="WikiWebView" component={WikiWebView} options={{ title: "WikiWebView" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
