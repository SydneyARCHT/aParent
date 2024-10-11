import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, Animated, Dimensions } from "react-native";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

// Colors matching the letters
const bubbleColors = ['#5BFF9F', '#AE5BFF', '#FF6D5B', '#FFC85B', '#5DEFFF'];

// Helper function to generate random bubbles
const generateRandomBubbles = (count) => {
  return Array.from({ length: count }).map((_, index) => {
    return <AnimatedBubble key={index} />;
  });
};

const AnimatedBubble = () => {
  const { width, height } = Dimensions.get("window");
  const size = Math.random() * 100 + 50; // Random size between 50 and 150
  const backgroundColor =
    bubbleColors[Math.floor(Math.random() * bubbleColors.length)] + "50"; // Random color with transparency

  // Generate a random starting position
  const initialX = Math.random() * width;
  const initialY = Math.random() * height;
  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  useEffect(() => {
    const moveBubble = () => {
      Animated.timing(position, {
        toValue: {
          x: position.x._value - Math.random() * 100 - 50, // Move leftward
          y: position.y._value - Math.random() * 100 - 50, // Move upward
        },
        duration: Math.random() * 4000 + 3000, // Random duration between 3s and 7s
        useNativeDriver: false,
      }).start(() => moveBubble()); // Start again for continuous movement
    };

    moveBubble();
  }, [position]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: size / 2,
          transform: position.getTranslateTransform(),
        },
      ]}
    />
  );
};

const CustomHeaderTitle = () => {
  return (
    <View style={styles.headerTitleContainer}>
      <Text style={[styles.headerLetter, { color: "#5BFF9F" }]}>a</Text>
      <Text style={[styles.headerLetter, { color: "#AE5BFF" }]}>P</Text>
      <Text style={[styles.headerLetter, { color: "#FF6D5B" }]}>a</Text>
      <Text style={[styles.headerLetter, { color: "#FFC85B" }]}>r</Text>
      <Text style={[styles.headerLetter, { color: "#5DEFFF" }]}>e</Text>
      <Text style={[styles.headerLetter, { color: "#AE5BFF" }]}>n</Text>
      <Text style={[styles.headerLetter, { color: "#AE5BFF" }]}>t</Text>
    </View>
  );
};

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {generateRandomBubbles(35)}

      <CustomHeaderTitle />
      <View style={styles.buttonsContainer}>
        <AppButton
          title="Login"
          color="teal"
          onPress={() => navigation.navigate("Login")}
        />
        <AppButton
          title="Register"
          color="purple"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 300,
  },
  buttonsContainer: {
    width: "100%",
    padding: 20,
    position: "absolute",
    bottom: 30,
  },
  headerLetter: {
    fontSize: 80,
    fontWeight: "bold",
    fontFamily: "BalsamiqSans_400Regular",
  },
  bubble: {
    position: "absolute",
  },
});

export default WelcomeScreen;