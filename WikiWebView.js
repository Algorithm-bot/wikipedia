import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const WikiWebView = ({ route }) => {
  const { url } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView 
        source={{ uri: url }} 
        startInLoadingState 
        renderLoading={() => <ActivityIndicator size="large" color="#007AFF" />} 
      />
    </View>
  );
};

export default WikiWebView;
