import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, Image } from "react-native";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // Sign Up
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      // Navigate to WikiFeed with uid
      navigation.navigate('WikiFeed', { uid });
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error (e.g., show alert)
    }
  };

  // Sign In
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      // Navigate to WikiFeed with uid
      navigation.navigate('WikiFeed', { uid });
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle error (e.g., show alert)
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./assets/icon.png")} style={styles.logo} />

      <Text style={styles.title}>Welcome to WikiFeed</Text>
      <Text style={styles.subtitle}>Get quick Wikipedia articles instantly!</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Ionicons name="log-in-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={handleSignUp}>
        <Ionicons name="person-add-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6200EE",
    width: "90%",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: "#03DAC6",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default SignInPage;
