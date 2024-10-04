import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/ChatScreen';
import ChatDetailsScreen from '../screens/ChatDetails';

const Stack = createStackNavigator();

function ChatStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatScreen} />
      <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
    </Stack.Navigator>
  );
}

export default ChatStackNavigator;