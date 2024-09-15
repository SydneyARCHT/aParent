import React from "react";
import { StyleSheet, View, Text, ImageBackground, Image } from "react-native";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

function LoginScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={2}
      style={styles.background}
      source={require("../assets/Hallways.jpg")} 
    >
      <Image style={styles.logo} source={require("../assets/LogoTEMP.png")} />
      <View style={styles.container}>
        <Text style={styles.heading}>Login</Text>
        <View style={styles.buttonsContainer}>
          <AppButton
            title="Login as Teacher"
            color="primary"
            onPress={() => navigation.navigate("Teacher")}
          />
          <AppButton
            title="Login as Parent"
            color="secondary"
            onPress={() => navigation.navigate("Parent")}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 160,
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default LoginScreen;