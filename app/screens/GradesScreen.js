import React from 'react';
import { Text, View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { List, Divider, useTheme } from 'react-native-paper';

const subjects = [
  { name: 'Math', grade: '75%' },
  { name: 'English', grade: '75%' },
  { name: 'Science', grade: '75%' },
  { name: 'Art', grade: '75%' },
  { name: 'Phys. Ed', grade: '75%' },
  { name: 'Music', grade: '75%' },
  { name: 'Reading', grade: '75%' },
  { name: 'French', grade: '75%' },
  { name: 'Social Studies', grade: '75%' },
];

function GradesScreen() {
  const { colors } = useTheme();

  const renderItem = ({ item }) => (
    <>
      <List.Item
        title={item.name}
        right={() => <Text style={styles.grade}>{item.grade}</Text>}
        left={() => <List.Icon icon="school" />}
        onPress={() => {}}
        style={styles.listItem} 
      />
      <Divider />
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          contentContainerStyle={{ 
            backgroundColor: colors.background,
            paddingHorizontal: 20, 
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', 
  },
  container: {
    flex: 1,
  },
  grade: {
    fontSize: 16,
    alignSelf: 'center',
    paddingRight: 15,
  },
  listItem: {
    marginLeft: 10, 
  },
});

export default GradesScreen;