import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, Image, StatusBar, SafeAreaView } from "react-native";
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
      if (!email || !password) {
        Alert.alert("Error", "Please enter both email and password.");
        return;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      navigation.navigate('WikiFeed', { uid });
    } catch (error) {
      console.error('Error signing up:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          "Account Exists",
          "This email is already registered. Please use the Sign In button instead.",
          [
            {
              text: "OK",
              style: "default"
            }
          ]
        );
      } else if (error.code === 'auth/weak-password') {
        Alert.alert("Error", "Password should be at least 6 characters long.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Please enter a valid email address.");
      } else {
        Alert.alert("New User?", "This email is not registered. Please use the Sign Up button to create a new account.");
      }
    }
  };

  // Sign In
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      navigation.navigate('WikiFeed', { uid });
    } catch (error) {
      console.error('Error signing in:', error);
      
      // Check for specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        Alert.alert(
          "New User?",
          "This email is not registered. Please use the Sign Up button to create a new account.",
          [
            {
              text: "OK",
              style: "default"
            }
          ]
        );
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert("Error", "Incorrect password. Please try again.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Please enter a valid email address.");
      } else {
        Alert.alert("New User?", "This email is not registered. Please use the Sign Up button to create a new account.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#121212"
      />
      <View style={styles.container}>
        <Image source={require("./assets/sign_in_page.png")} style={styles.logo} />

        <Text style={styles.title}>Welcome to WikiFeed</Text>
        <Text style={styles.subtitle}>Get quick Wikipedia articles instantly!</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
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
    backgroundColor: "white",
    borderRadius: 8,
    color: "black",
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
