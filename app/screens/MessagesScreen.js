
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Chat from './ChatScreen';
import DrawerComponent from '../navigation/DrawerComponent';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MessagesScreenContent() {
  return (
    <SafeAreaView style={styles.container}>
      <Chat /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const MessagesScreen = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen name="Resources" component={MessagesScreenContent} />
    </Drawer.Navigator>
  );
};

export default MessagesScreen;