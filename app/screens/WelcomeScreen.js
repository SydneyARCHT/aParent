import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import colors from "../config/colors";  

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/LogoTEMP.png")} />
      <View style={styles.buttonsContainer}>
        <AppButton
          title="Login"
          color="primary"  
          onPress={() => navigation.navigate("Login")}
        />
        <AppButton
          title="Register"
          color="pink"  
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 160,
  },
});

export default WelcomeScreen;