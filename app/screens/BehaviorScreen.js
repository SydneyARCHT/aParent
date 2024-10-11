import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const BehaviorScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Behavior</Text>

        <View style={styles.row}>
          <View style={[styles.quadrant, styles.topLeft, { backgroundColor: '#c69af6' }]}>
            <Text style={styles.quadrantTitle}>Positive Mindset</Text>
            <Text style={styles.quadrantSubtitle}>Satisfactory</Text>
          </View>
          <View style={[styles.quadrant, styles.topRight, { backgroundColor: '#81e6d9' }]}>
            <Text style={styles.quadrantTitle}>Thinking Skills</Text>
            <Text style={styles.quadrantSubtitle}>Needs Improvement</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.quadrant, styles.bottomLeft, { backgroundColor: '#c69af6' }]}>
            <Text style={styles.quadrantTitle}>Community Mindset</Text>
            <Text style={styles.quadrantSubtitle}>Good</Text>
          </View>
          <View style={[styles.quadrant, styles.bottomRight, { backgroundColor: '#f6ad55' }]}>
            <Text style={styles.quadrantTitle}>Interpersonal Skills</Text>
            <Text style={styles.quadrantSubtitle}>Average</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  quadrant: {
    width: '45%', 
    height: 180,  
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30, 
    padding: 10,
  },
  topLeft: {
    borderTopLeftRadius: 150, 
    borderTopRightRadius: 0,   
    borderBottomLeftRadius: 0,
  },
  topRight: {
    borderTopRightRadius: 150, 
    borderTopLeftRadius: 0, 
    borderBottomRightRadius: 0, 
  },
  bottomLeft: {
    borderBottomLeftRadius: 150,
    borderTopLeftRadius: 0, 
    borderBottomRightRadius: 0,    
  },
  bottomRight: {
    borderBottomRightRadius: 150, 
    borderTopRightRadius: 0, 
    borderBottomLeftRadius: 0,    
  },
  quadrantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3d3d3d',
    marginBottom: 5,
  },
  quadrantSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#3d3d3d',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
});

export default BehaviorScreen;