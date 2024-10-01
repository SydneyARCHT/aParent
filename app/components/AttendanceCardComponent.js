import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const AttendanceCardComponent = ({ data }) => {
  const timestamp = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'No timestamp available';
  const status = data.on_time ? 'on time' : 'late';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{`${data.studentName} was ${status} to ${data.className}`}</Text>
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
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default AttendanceCardComponent;