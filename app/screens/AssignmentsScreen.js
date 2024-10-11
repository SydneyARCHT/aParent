import React, { useState, useLayoutEffect } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebaseConfig';

function AssignmentsScreen() {
  const [assignments, setAssignments] = useState([]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, 'assignments');
    const q = query(collectionRef, orderBy('date_created', 'desc')); 

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setAssignments(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  const renderAssignment = ({ item }) => {
    const classValue = typeof item.class === 'object' ? 'Loading...' : item.class; 
    const typeValue = typeof item.type === 'object' ? 'Loading...' : item.type; 

    return (
      <View style={styles.assignment}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text>Class: {classValue}</Text>
        <Text>Type: {typeValue}</Text>
        <Text>Date Assigned: {new Date(item.date_assigned.seconds * 1000).toLocaleDateString()}</Text>
        <Text>Due Date: {new Date(item.due_date.seconds * 1000).toLocaleDateString()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={renderAssignment}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  flatListContent: {
    padding: 20,
  },
  assignment: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AssignmentsScreen;