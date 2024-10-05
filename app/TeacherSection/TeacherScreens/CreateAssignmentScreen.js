import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { database } from '../../config/firebaseConfig';
import { Timestamp } from 'firebase/firestore'; 

function CreateAssignmentScreen() {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignmentClass, setAssignmentClass] = useState(''); 
  const [assignmentType, setAssignmentType] = useState(''); 
  const [dateAssigned, setDateAssigned] = useState(''); 

  useLayoutEffect(() => {
    const collectionRef = collection(database, 'assignments');
    const q = query(collectionRef, orderBy('date_created', 'desc')); 

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setAssignments(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  const addAssignment = useCallback(async () => {
    if (title && description && dueDate && assignmentClass && assignmentType && dateAssigned) {
      const assignedTimestamp = Timestamp.fromDate(new Date(dateAssigned));
      const dueTimestamp = Timestamp.fromDate(new Date(dueDate));
      const createdTimestamp = Timestamp.now(); 

      await addDoc(collection(database, 'assignments'), {
        name: title,
        description,
        due_date: dueTimestamp,
        date_assigned: assignedTimestamp,
        date_created: createdTimestamp,
        class: assignmentClass,
        type: assignmentType, 
      });


      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignmentClass('');
      setAssignmentType('');
      setDateAssigned('');
    }
  }, [title, description, dueDate, assignmentClass, assignmentType, dateAssigned]);

  const getClassDetails = async (classRef) => {
    if (typeof classRef === 'object' && classRef._key) {
      const docSnapshot = await getDoc(classRef); 
      return docSnapshot.exists() ? docSnapshot.data().name : 'Unknown Class';
    }
    return classRef; 
  };

  const getTypeDetails = async (typeRef) => {
    if (typeof typeRef === 'object' && typeRef._key) {
      const docSnapshot = await getDoc(typeRef); 
      return docSnapshot.exists() ? docSnapshot.data().name : 'Unknown Type';
    }
    return typeRef; 
  };

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
        ListHeaderComponent={
          <View>
            <TextInput
              style={styles.input}
              placeholder="Assignment Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Class"
              value={assignmentClass}
              onChangeText={setAssignmentClass}
            />
            <TextInput
              style={styles.input}
              placeholder="Assignment Type"
              value={assignmentType}
              onChangeText={setAssignmentType}
            />
            <TextInput
              style={styles.input}
              placeholder="Date Assigned (YYYY-MM-DD)"
              value={dateAssigned}
              onChangeText={setDateAssigned}
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={dueDate}
              onChangeText={setDueDate}
            />
            <Button title="Create Assignment" onPress={addAssignment} />
          </View>
        }
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
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

export default CreateAssignmentScreen;