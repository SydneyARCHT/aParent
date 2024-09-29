import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ResourcesScreen from './ResourcesScreen';



function ParentResourcesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ResourcesScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
  },
});

export default ParentResourcesScreen;