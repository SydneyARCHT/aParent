import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const onHandleLogin = async () => {
      if (email !== "" && password !== "") {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
  
          const userDoc = await getDoc(doc(database, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Login success", userData);
  
            // Navigate based on user type
            if (userData.userType === "parent") {
              navigation.navigate("Parent");
            } else if (userData.userType === "teacher") {
              navigation.navigate("Teacher");
            } else {
              Alert.alert("Login error", "Unknown user type.");
            }
          } else {
            Alert.alert("Login error", "User data not found.");
          }
        } catch (err) {
          Alert.alert("Login error", err.message);
        }
      } else {
        Alert.alert("Input Error", "Please fill in both fields.");
      }
    };
    
    return (
      <View style={styles.container}>
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}>Log In</Text>
           <TextInput
          style={styles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}> Log In</Text>
        </TouchableOpacity>
        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{color: '#e91e63', fontWeight: '600', fontSize: 14}}> Sign Up</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
        <StatusBar barStyle="light-content" />
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: "#e91e63",
      alignSelf: "center",
      paddingBottom: 24,
    },
    input: {
      backgroundColor: "#F6F7FB",
      height: 58,
      marginBottom: 20,
      fontSize: 16,
      borderRadius: 10,
      padding: 12,
    },
    backImage: {
      width: "100%",
      height: 340,
      position: "absolute",
      top: 0,
      resizeMode: 'cover',
    },
    whiteSheet: {
      width: '100%',
      height: '75%',
      position: "absolute",
      bottom: 0,
      backgroundColor: '#fff',
      borderTopLeftRadius: 60,
    },
    form: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 30,
    },
    button: {
      backgroundColor: '#e91e63',
      height: 58,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
  });