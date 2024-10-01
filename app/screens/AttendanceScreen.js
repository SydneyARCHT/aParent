import React from "react";
import { StyleSheet, View, Text } from "react-native";

function AttendanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Attendance Screen</Text>
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

export default AttendanceScreen;