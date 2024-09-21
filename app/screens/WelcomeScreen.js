import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={10}
      style={styles.background}
      source={require("../assets/background.jpg.jpg")}
    >
      <Image style={styles.logo} source={require("../assets/LogoTEMP.png")} />
      <View style={styles.buttonsContainer}>
      <AppButton title="Login" color="primary" onPress={() => navigation.navigate("Login")} /> 
      <AppButton title="Register" color="secondary" onPress={() => navigation.navigate("Register")} /> 
      </View>
    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: '100%'
  },
  logo: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 160,
  }
});

export default WelcomeScreen;
