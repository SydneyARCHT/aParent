import React from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, SafeAreaView } from 'react-native';

const behaviorData = [
  {
    id: '1',
    title: 'Positive Mindset',
    subtitle: 'Satisfactory',
    position: 'topLeftImage',
    image: 'https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg',
  },
  {
    id: '2',
    title: 'Thinking Skills',
    subtitle: 'Needs Improvement',
    position: 'topRightImage',
    image: 'https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg',
  },
  {
    id: '3',
    title: 'Community Mindset',
    subtitle: 'Good',
    position: 'bottomLeftImage',
    image: 'https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg',
  },
  {
    id: '4',
    title: 'Interpersonal Skills',
    subtitle: 'Average',
    position: 'bottomRightImage',
    image: 'https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg',
  },
];

const BehaviorScreen = () => {
  const renderQuadrant = ({ item }) => {
    const positionStyle = styles[item.position] || {};

    return (
      <ImageBackground
        source={{ uri: item.image }}
        style={[styles.quadrant, positionStyle]}
        imageStyle={[styles.imageStyle, positionStyle]}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.quadrantTitle}>{item.title}</Text>
          <Text style={styles.quadrantSubtitle}>{item.subtitle}</Text>
        </View>
      </ImageBackground>
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
  imageStyle: {
    borderRadius: 20,
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



