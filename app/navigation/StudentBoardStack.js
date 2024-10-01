import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudentBoardScreen from '../screens/StudentBoardScreen';
import GradesScreen from '../screens/GradesScreen'; 
import AssignmentsScreen from '../screens/AssignmentsScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import BehaviorScreen from '../screens/BehaviorScreen';

const Stack = createStackNavigator();

function StudentBoardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentBoard" component={StudentBoardScreen} />
      <Stack.Screen name="Grades" component={GradesScreen} />
      <Stack.Screen name="Assignments" component={AssignmentsScreen} /> 
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Behavior" component={BehaviorScreen} /> 
    </Stack.Navigator>
  );
}

export default StudentBoardStack;