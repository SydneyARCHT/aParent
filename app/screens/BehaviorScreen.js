import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const BehaviorScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Behavior</Text>

        {/* First Row (Top Rounded Sections) */}
        <View style={styles.row}>
          <View style={[styles.quadrant, styles.topLeft]}>
            <Text style={styles.quadrantTitle}>Positive Mindset</Text>
            <Text style={styles.quadrantSubtitle}>Satisfactory</Text>
          </View>
          <View style={[styles.quadrant, styles.topRight]}>
            <Text style={styles.quadrantTitle}>Thinking Skills</Text>
            <Text style={styles.quadrantSubtitle}>Needs Improvement</Text>
          </View>
        </View>

        {/* Second Row (Bottom Square Sections) */}
        <View style={styles.row}>
          <View style={[styles.quadrant, styles.bottomLeft]}>
            <Text style={styles.quadrantTitle}>Community Mindset</Text>
            <Text style={styles.quadrantSubtitle}>Good</Text>
          </View>
          <View style={[styles.quadrant, styles.bottomRight]}>
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
    backgroundColor: '#f5f5f5',
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  quadrant: {
    width: '45%', 
    height: 220,  
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#888',
    borderRadius: 30, 
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
    color: '#fff',
  },
  quadrantSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ddd',
  },
});

export default BehaviorScreen;