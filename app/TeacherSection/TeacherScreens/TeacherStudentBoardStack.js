import React from "react";
import { StyleSheet, View, Text } from "react-native";

function TeacherStudentBoardStackScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Teacher Student Board Screen</Text>
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

export default TeacherStudentBoardStackScreen;