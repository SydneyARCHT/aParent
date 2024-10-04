import React from "react";
import { StyleSheet, View, Text } from "react-native";
import TeacherDrawerComponent from "../TeacherNavigation/TeacherDrawerComponent";
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function TeacherScreenContent() {
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

const TeacherScreen = () => {
  return (
    <Drawer.Navigator drawerContent={props => <TeacherDrawerComponent {...props} />}>
      <Drawer.Screen name="Home" component={TeacherScreenContent} />
    </Drawer.Navigator>
  );
};

export default TeacherScreen;