import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerComponent from '../navigation/DrawerComponent'; 
import CardComponent from '../components/CardComponent'; 
import FakeComp1 from '../components/FakeComp1';
import FakeComp2 from '../components/FakeComp2';
import MessagesScreen from '../screens/MessagesScreen';
import StudentBoardScreen from '../screens/StudentBoardScreen';
import ParentResourcesScreen from '../screens/ParentResourceScreen';

const Drawer = createDrawerNavigator();

function ParentScreenContent() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.myComponentContainer}>
            <CardComponent />
            <FakeComp1 />
            <FakeComp2 /> 
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ParentScreen() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen name="ParentHome" component={ParentScreenContent} />
      <Drawer.Screen name="Messages" component={MessagesScreen} />
      <Drawer.Screen name="StudentBoard" component={StudentBoardScreen} />
      <Drawer.Screen name="ParentResources" component={ParentResourcesScreen} />
    </Drawer.Navigator>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1, 
  },
  scrollViewContainer: {
    flexGrow: 1, 
    paddingHorizontal: 1,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 70, 
  },
  text: {
    fontSize: 24,
    marginVertical: 16,
  },
  myComponentContainer: {
    width: '100%', 
    paddingHorizontal: 1, 
    paddingVertical: 8, 
  },
});

export default ParentScreen;


