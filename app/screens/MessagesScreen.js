
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Chat from './ChatScreen';

function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Chat /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MessagesScreen;