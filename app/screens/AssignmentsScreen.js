import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, Animated, Dimensions } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebaseConfig';

// Colors matching the letters
const bubbleColors = ['#5BFF9F', '#AE5BFF', '#FF6D5B', '#FFC85B', '#5DEFFF'];

// Helper function to generate random bubbles
const generateRandomBubbles = (count) => {
  return Array.from({ length: count }).map((_, index) => {
    return <AnimatedBubble key={index} />;
  });
};

const AnimatedBubble = () => {
  const { width, height } = Dimensions.get('window');
  const size = Math.random() * 100 + 50; // Random size between 50 and 150
  const backgroundColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)] + '50'; // Random color with transparency

  // Generate a random starting position
  const initialX = Math.random() * width;
  const initialY = Math.random() * height;
  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  useEffect(() => {
    const moveBubble = () => {
      Animated.timing(position, {
        toValue: {
          x: position.x._value - Math.random() * 100 - 50, // Move leftward
          y: position.y._value - Math.random() * 100 - 50, // Move upward
        },
        duration: Math.random() * 4000 + 3000, // Random duration between 3s and 7s
        useNativeDriver: false,
      }).start(() => moveBubble()); // Start again for continuous movement
    };

    moveBubble();
  }, [position]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: size / 2,
          transform: position.getTranslateTransform(),
        },
      ]}
    />
  );
};

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
      {generateRandomBubbles(20)}
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
  bubble: {
    position: 'absolute',
  },
});

export default AssignmentsScreen;