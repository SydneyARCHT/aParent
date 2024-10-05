import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageScreen from '../TeacherScreens/ManageScreen';
import CreateAssignmentScreen from '../TeacherScreens/CreateAssignmentScreen';

const Stack = createStackNavigator();

function ManageStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Manage" component={ManageScreen} />
        <Stack.Screen name="CreateAssignment" component={CreateAssignmentScreen} /> 
      </Stack.Navigator>
    );
  }
  
  export default ManageStack;