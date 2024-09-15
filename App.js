
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import TeacherScreen from "./app/screens/TeacherScreen"; 
import ParentScreen from "./app/screens/ParentScreen"; 
import MessagesScreen from "./app/screens/MessagesScreen";
import StudentBoardScreen from "./app/screens/StudentBoardScreen";
import ParentResourcesScreen from "./app/screens/ParentResourceScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Teacher" component={TeacherScreen} />
        <Stack.Screen name="Parent" component={ParentScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="StudentBoard" component={StudentBoardScreen} />
        <Stack.Screen name="ParentResources" component={ParentResourcesScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}