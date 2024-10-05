import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import TeacherDrawerComponent from "../TeacherNavigation/TeacherDrawerComponent";

const Drawer = createDrawerNavigator();

function TeacherStudentBoardStackScreenContent() {
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

const TeacherStudentBoardStackScreen = () => {
    return (
      <Drawer.Navigator drawerContent={props => <TeacherDrawerComponent {...props} />}>
        <Drawer.Screen name="Student Board" component={TeacherStudentBoardStackScreenContent} />
      </Drawer.Navigator>
    );
  };

export default TeacherStudentBoardStackScreen;