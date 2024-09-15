import React from "react";
import { StyleSheet, View, Text } from "react-native";

function TeacherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Teacher Screen</Text>
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

export default TeacherScreen;