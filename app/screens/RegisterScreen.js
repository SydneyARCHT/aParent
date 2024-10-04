import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../config/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState('parent');
  const [items, setItems] = useState([
    { label: 'Parent', value: 'parent' },
    { label: 'Teacher', value: 'teacher' }
  ]);

  const onHandleSignup = async () => {
    if (email !== '' && password !== '' && confirmPassword !== '' && firstName !== '' && lastName !== '') {
      if (password !== confirmPassword) {
        Alert.alert("Password Error", "Passwords do not match.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(database, "users", user.uid), {
          email: user.email,
          is_active: true,
          name: `${firstName} ${lastName}`,
          userType: userType
        });

        // Add to specific user type collection (parent or teacher)
        if (userType === 'parent') {
          await setDoc(doc(database, "parents", user.uid), {
            name: `${firstName} ${lastName}`,
            user_id: user.uid
          });
        } else if (userType === 'teacher') {
          await setDoc(doc(database, "teachers", user.uid), {
            name: `${firstName} ${lastName}`,
            user_id: user.uid
          });
        }

        Alert.alert("Sign Up Successful", "You have successfully signed up!");
      } catch (err) {
        Alert.alert("Sign Up Error", err.message);
      }
    } else {
      Alert.alert("Input Error", "Please fill in all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Register</Text>
        
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <View style={{ marginBottom: 80 }}>
          <DropDownPicker
            open={open}
            value={userType}
            items={items}
            setOpen={setOpen}
            setValue={setUserType}
            setItems={setItems}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Register</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: '#e91e63', fontWeight: '600', fontSize: 14 }}>Log In</Text>
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