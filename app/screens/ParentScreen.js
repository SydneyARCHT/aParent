import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerComponent from '../navigation/DrawerComponent'; 
import CardComponent from '../components/CardComponent'; 

const Drawer = createDrawerNavigator();

function ParentScreenContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#e91e63']} 
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.myComponentContainer}>
            <CardComponent />
            <CardComponent /> 
            <CardComponent /> 
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ParentScreen() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen name="Parent Home" component={ParentScreenContent} />
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
  myComponentContainer: {
    width: '100%', 
    paddingHorizontal: 1, 
    paddingVertical: 8, 
  },
});

export default ParentScreen;