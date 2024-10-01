import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Linking } from 'react-native';

const ResourcesScreen = () => {
  const articles = [
    { id: '1', title: 'Improve learning skills', subtitle: '5 techniques for better behavior', image: 'https://via.placeholder.com/150', url: 'https://www.learnfasthq.com/blog/9-tips-to-improve-how-you-learn-your-learning-capacity' },
    { id: '2', title: 'Motivating your child', subtitle: 'Effective strategies for parents', image: 'https://via.placeholder.com/150', url: 'https://developingchild.harvard.edu/resources/how-to-motivate-children-science-based-approaches-for-parents-caregivers-and-teachers/#:~:text=Praise%20the%20process%20rather%20than%20the%20outcome.&text=When%20we%20praise%20children%20for%20their%20effort%20and%20help%20them,they%20put%20their%20mind%20to.' },
    { id: '3', title: 'Develop study habits', subtitle: 'Tools and tips for success', image: 'https://via.placeholder.com/150', url: 'https://www.coursera.org/articles/study-habits' },
    { id: '4', title: 'Time management for students', subtitle: 'Master time and productivity', image: 'https://via.placeholder.com/150', url: 'https://summer.harvard.edu/blog/8-time-management-tips-for-students/' },
    { id: '5', title: 'Boost concentration', subtitle: 'Tips for better focus', image: 'https://via.placeholder.com/150', url: 'https://www.teachstarter.com/us/blog/10-ways-to-improve-student-concentration-us/' },
  ];

  const mathResources = [
    { id: '1', title: 'Free math tutor online', subtitle: 'Free for all students', image: 'https://via.placeholder.com/150', url: 'https://schoolhouse.world/' },
    { id: '2', title: 'Math practice games', subtitle: 'Interactive and fun learning', image: 'https://via.placeholder.com/150', url: 'https://www.mathgames.com/' },
    { id: '3', title: 'Math for beginners', subtitle: 'Basic concepts explained', image: 'https://via.placeholder.com/150', url: 'https://www.khanacademy.org/math' },
    { id: '4', title: 'Algebra tips', subtitle: 'Step-by-step algebra help', image: 'https://via.placeholder.com/150', url: 'https://tlp-lpa.ca/math-tutorials/algebra' },
    { id: '5', title: 'Geometry fun', subtitle: 'Learn geometry with fun activities', image: 'https://via.placeholder.com/150', url: 'https://www.mathsisfun.com/geometry/' },
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
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles</Text>
          <FlatList
            data={articles}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Math</Text>
          <FlatList
            data={mathResources}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Science</Text>
          <FlatList
            data={scienceResources}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>English</Text>
          <FlatList
            data={englishResources}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          <FlatList
            data={historyResources}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
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
  sectionTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  horizontalList: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    width: 220,  
    alignItems: 'center', 
  },
  cardImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ResourcesScreen;
