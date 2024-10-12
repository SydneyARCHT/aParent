import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const behaviorData = [
  {
    id: '1',
    title: 'Positive Mindset',
    subtitle: 'Satisfactory',
    position: 'topLeftImage',
    color: '#FFCDD2',
  },
  {
    id: '2',
    title: 'Thinking Skills',
    subtitle: 'Needs Improvement',
    position: 'topRightImage',
    color: '#BBDEFB',
  },
  {
    id: '3',
    title: 'Community Mindset',
    subtitle: 'Good',
    position: 'bottomLeftImage',
    color: '#C8E6C9',
  },
  {
    id: '4',
    title: 'Interpersonal Skills',
    subtitle: 'Average',
    position: 'bottomRightImage',
    color: '#FFF9C4',
  },
];

const BehaviorScreen = () => {
  const renderQuadrant = ({ item }) => {
    const positionStyle = styles[item.position] || {};

    return (
      <View
        style={[
          styles.quadrant,
          positionStyle,
          { backgroundColor: item.color },
        ]}
      >
        <View style={styles.overlay}>
          <Text style={styles.quadrantTitle}>{item.title}</Text>
          <Text style={styles.quadrantSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={behaviorData}
          renderItem={renderQuadrant}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={() => (
            <Text style={styles.header}>Behavior</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  listContainer: {
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
    color: '#333',
  },
  quadrant: {
    width: 189,
    height: 270,
    margin: 5,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
    borderRadius: 10,
  },
  quadrantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
  },
  quadrantSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  topLeftImage: {
    borderTopLeftRadius: 160,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  topRightImage: {
    borderTopRightRadius: 160,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomLeftImage: {
    borderBottomLeftRadius: 160,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomRightImage: {
    borderBottomRightRadius: 160,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
});

export default BehaviorScreen;