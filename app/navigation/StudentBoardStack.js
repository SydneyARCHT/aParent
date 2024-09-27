import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudentBoardScreen from '../screens/StudentBoardScreen';
import GradesScreen from '../screens/GradesScreen'; 

const Stack = createStackNavigator();

function StudentBoardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentBoard" component={StudentBoardScreen} />
      <Stack.Screen name="Grades" component={GradesScreen} />
    </Stack.Navigator>
  );
}

export default StudentBoardStack;