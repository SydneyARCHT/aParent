import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import MyComponent from '../components/CardComponent'; // Ensure the path is correct
import FakeComp1 from '../components/FakeComp1';
import FakeComp2 from '../components/FakeComp2';

function ParentScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.text}>Parent Home</Text>
          <View style={styles.myComponentContainer}>
            <MyComponent />
            <FakeComp1 />
            <FakeComp2 /> 
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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