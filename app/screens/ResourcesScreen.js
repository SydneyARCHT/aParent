import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Linking } from 'react-native';
import DrawerComponent from '../navigation/DrawerComponent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const ResourcesScreenContent = () => {
  const articles = [
    { id: '1', title: 'Improve Learning Skills', subtitle: '5 techniques for better behavior', image: 'https://via.placeholder.com/150', url: 'https://www.learnfasthq.com/blog/9-tips-to-improve-how-you-learn-your-learning-capacity' },
    { id: '2', title: 'Motivating Your Child', subtitle: 'Effective strategies for parents', image: 'https://via.placeholder.com/150', url: 'https://developingchild.harvard.edu/resources/how-to-motivate-children-science-based-approaches-for-parents-caregivers-and-teachers/#:~:text=Praise%20the%20process%20rather%20than%20the%20outcome.&text=When%20we%20praise%20children%20for%20their%20effort%20and%20help%20them,they%20put%20their%20mind%20to.' },
    { id: '3', title: 'Develop Study Habits', subtitle: 'Tools and tips for success', image: 'https://via.placeholder.com/150', url: 'https://www.coursera.org/articles/study-habits' },
    { id: '4', title: 'Time Management for Students', subtitle: 'Master time and productivity', image: 'https://via.placeholder.com/150', url: 'https://summer.harvard.edu/blog/8-time-management-tips-for-students/' },
    { id: '5', title: 'Boost Concentration', subtitle: 'Tips for better focus', image: 'https://via.placeholder.com/150', url: 'https://www.teachstarter.com/us/blog/10-ways-to-improve-student-concentration-us/' },
  ];

  const mathResources = [
    { id: '1', title: 'Free Math Tutor Online', subtitle: 'Free for all students', image: 'https://via.placeholder.com/150', url: 'https://schoolhouse.world/' },
    { id: '2', title: 'Math Practice Games', subtitle: 'Interactive and fun learning', image: 'https://via.placeholder.com/150', url: 'https://www.mathgames.com/' },
    { id: '3', title: 'Math for Beginners', subtitle: 'Basic concepts explained', image: 'https://via.placeholder.com/150', url: 'https://www.khanacademy.org/math' },
    { id: '4', title: 'Algebra Tips', subtitle: 'Step-by-step algebra help', image: 'https://via.placeholder.com/150', url: 'https://tlp-lpa.ca/math-tutorials/algebra' },
    { id: '5', title: 'Geometry Fun', subtitle: 'Learn geometry with fun activities', image: 'https://via.placeholder.com/150', url: 'https://www.mathsisfun.com/geometry/' },
  ];

  const scienceResources = [
    { id: '1', title: 'Physics for Kids', subtitle: 'Basic concepts in physics explained', image: 'https://via.placeholder.com/150', url: 'https://www.ducksters.com/science/physics/' },
    { id: '2', title: 'Chemistry Fun', subtitle: 'Easy chemistry experiments', image: 'https://via.placeholder.com/150', url: 'https://www.acs.org/education/whatischemistry/adventures-in-chemistry/experiments.html' },
    { id: '3', title: 'Biology Basics', subtitle: 'Learn about ecosystems', image: 'https://via.placeholder.com/150', url: 'https://www.ducksters.com/science/biology/' },
    { id: '4', title: 'Space Exploration', subtitle: 'Explore the universe', image: 'https://via.placeholder.com/150', url: 'https://kids.britannica.com/kids/article/space-exploration/353794' },
    { id: '5', title: 'The Scientific Method', subtitle: 'Understanding science processes', image: 'https://via.placeholder.com/150', url: 'https://littlebinsforlittlehands.com/using-scientific-method-experiments-kids/' },
  ];

  const englishResources = [
    { id: '1', title: 'Grammar Essentials', subtitle: 'Key grammar rules', image: 'https://via.placeholder.com/150', url: 'https://www.scholastic.com/parents/school-success/homework-help/learn-a-subject/parent-primer-grammar.html' },
    { id: '2', title: 'Creative Writing Tips', subtitle: 'Develop your writing skills', image: 'https://via.placeholder.com/150', url: 'https://www.nightzookeeper.com/blog/articles/creative-writing-for-kids-step-by-step' },
    { id: '3', title: 'Reading Comprehension', subtitle: 'Improve understanding', image: 'https://via.placeholder.com/150', url: 'https://www.k5learning.com/reading-comprehension-worksheets' },
    { id: '4', title: 'Shakespeare Basics', subtitle: 'Introduction to Shakespeare', image: 'https://via.placeholder.com/150', url: 'https://www.folger.edu/explore/shakespeare-for-kids/' },
    { id: '5', title: 'Poetry for Beginners', subtitle: 'Learn to write poetry', image: 'https://via.placeholder.com/150', url: 'https://poetry4kids.com/' },
  ];

  const historyResources = [
    { id: '1', title: 'World War II Overview', subtitle: 'Major events of WWII', image: 'https://via.placeholder.com/150', url: 'https://www.natgeokids.com/uk/discover/history/general-history/world-war-two/' },
    { id: '2', title: 'Ancient Civilizations', subtitle: 'Explore the history of Rome, Egypt, and Greece', image: 'https://via.placeholder.com/150', url: 'https://kids.britannica.com/students/article/ancient-civilization/272856' },
    { id: '3', title: 'American Revolution', subtitle: 'The birth of the USA', image: 'https://via.placeholder.com/150', url: 'https://kids.britannica.com/kids/article/American-Revolution/353711' },
    { id: '4', title: 'History of Democracy', subtitle: 'From Ancient Greece to modern times', image: 'https://via.placeholder.com/150', url: 'https://kids.britannica.com/students/article/democracy/273962' },
    { id: '5', title: 'The Renaissance', subtitle: 'A rebirth of art and culture', image: 'https://via.placeholder.com/150', url: 'https://www.ducksters.com/history/renaissance.php' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
    </TouchableOpacity>
  );

  const renderSection = (title, data) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialIcons name="arrow-forward" size={24} color="black" />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderSection('Articles', articles)}
        {renderSection('Math', mathResources)}
        {renderSection('Science', scienceResources)}
        {renderSection('English', englishResources)}
        {renderSection('History', historyResources)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 33,
    fontWeight: 'bold',
  },
  horizontalList: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    width: 320,
    alignItems: 'flex-start', 
    height: 220
  },
  cardImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginTop: 8, 
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left', 
    marginBottom: 4, 
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left', 
    marginBottom: 8, 
  },
});


const ResourcesScreen = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen name="Resources" component={ResourcesScreenContent} />
    </Drawer.Navigator>
  );
};

export default ResourcesScreen;