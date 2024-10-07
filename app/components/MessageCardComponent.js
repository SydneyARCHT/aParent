import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const MessageCardComponent = ({ data }) => {
  // Check if all necessary fields exist, otherwise provide fallback values
  const title = data.title || 'New Message';
  const content = data.content || 'No content available';
  const timestamp = data.timestamp && data.timestamp.seconds
    ? new Date(data.timestamp.seconds * 1000).toLocaleString()
    : 'No timestamp available';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
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
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default MessageCardComponent;
