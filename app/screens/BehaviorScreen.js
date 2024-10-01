import React from "react";
import { StyleSheet, View, Text } from "react-native";

function BehaviorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Behavior Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});

export default BehaviorScreen;