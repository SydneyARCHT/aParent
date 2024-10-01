import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const GradeCardComponent = ({ data }) => {
  const timestamp = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'No timestamp available';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{`${data.studentName}'s ${data.assignmentName} has been graded!`}</Text>
      <Text style={styles.content}>{`Grade given: ${data.grade}`}</Text>
      <Text style={styles.feedback}>{data.feedback}</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    marginVertical: 8,
  },
  feedback: {
    fontSize: 14,
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default GradeCardComponent;