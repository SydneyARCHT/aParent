import * as React from "react";
import { Text, StyleSheet, useColorScheme } from "react-native";
import Colors from "../config/colors";


export default function MyText({ children, type = "body", style }) {
  const theme = useColorScheme();
  return (
    <Text style={[styles[type], { color: Colors[theme].text }, style]}>
      {children}
    </Text>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  body: {
    fontSize: 18,
  },
  caption: {
    fontSize: 14,
  },
});
