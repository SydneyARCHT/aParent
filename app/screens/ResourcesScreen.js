import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Linking } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import DrawerComponent from '../navigation/DrawerComponent';

const Drawer = createDrawerNavigator();

const ResourcesScreenContent = () => {
  const articles = [
    { id: '1', title: 'Improve Learning Skills', subtitle: '5 techniques for better behavior', image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?cs=srgb&dl=pexels-max-fischer-5212345.jpg&fm=jpg', url: 'https://www.learnfasthq.com/blog/9-tips-to-improve-how-you-learn-your-learning-capacity' },
    { id: '2', title: 'Motivating Your Child', subtitle: 'Effective strategies for parents', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIx8Ff4KBTDcsZxsLApPpHHzO60-OvK9MbBg&s', url: 'https://developingchild.harvard.edu/resources/how-to-motivate-children-science-based-approaches-for-parents-caregivers-and-teachers/#:~:text=Praise%20the%20process%20rather%20than%20the%20outcome.&text=When%20we%20praise%20children%20for%20their%20effort%20and%20help%20them,they%20put%20their%20mind%20to.' },
    { id: '3', title: 'Develop Study Habits', subtitle: 'Tools and tips for success', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh-vpwpiwQsF8zJATE2_WTh7zc6dn4xYpEEQ&s', url: 'https://www.coursera.org/articles/study-habits' },
    { id: '4', title: 'Time Management for Students', subtitle: 'Master time and productivity', image: 'https://www.shutterstock.com/image-photo/smart-girl-sitting-stack-books-260nw-1106105864.jpg', url: 'https://summer.harvard.edu/blog/8-time-management-tips-for-students/' },
    { id: '5', title: 'Boost Concentration', subtitle: 'Tips for better focus', image: 'https://www.shutterstock.com/image-photo/sad-upset-lazy-unmotivated-tired-260nw-2436133939.jpg', url: 'https://www.teachstarter.com/us/blog/10-ways-to-improve-student-concentration-us/' },
  ];

  const mathResources = [
    { id: '1', title: 'Free Math Tutor Online', subtitle: 'Free for all students', image: 'https://media.istockphoto.com/id/1358852926/photo/math-teacher-in-the-classroom.jpg?s=612x612&w=0&k=20&c=urswdbx3Z0zt-X7_qMj6Uj5i_V1YXPpT282ISr2W_74=', url: 'https://schoolhouse.world/' },
    { id: '2', title: 'Math Practice Games', subtitle: 'Interactive and fun learning', image: 'https://media.istockphoto.com/id/871510112/photo/kids-playing-with-puzzle-education-concept.jpg?s=612x612&w=0&k=20&c=DZPgohGcS7VszqsKGbmkTf6xp5g3qKxzVwPuEaFT0y4=', url: 'https://www.mathgames.com/' },
    { id: '3', title: 'Math for Beginners', subtitle: 'Basic concepts explained', image: 'https://media.istockphoto.com/id/1391720645/photo/shot-of-a-little-girl-doing-maths-on-a-board-in-a-classroom.jpg?s=612x612&w=0&k=20&c=7rJMhQ1o79qg-e3ZE-uCR_Ntb3nuYR7Ix2QoW8nbQGU=', url: 'https://www.khanacademy.org/math' },
    { id: '4', title: 'Algebra Tips', subtitle: 'Step-by-step algebra help', image: 'https://media.istockphoto.com/id/1219382595/vector/math-equations-written-on-a-blackboard.jpg?s=612x612&w=0&k=20&c=ShVWsMm2SNCNcIjuWGtpft0kYh5iokCzu0aHPC2fV4A=', url: 'https://tlp-lpa.ca/math-tutorials/algebra' },
    { id: '5', title: 'Geometry Fun', subtitle: 'Learn geometry with fun activities', image: 'https://as1.ftcdn.net/v2/jpg/02/41/73/42/1000_F_241734232_ESFsb70Fpq51IsI0TIKdZu4QFceqzgX4.jpg', url: 'https://www.mathsisfun.com/geometry/' },
  ];

  const scienceResources = [
    { id: '1', title: 'Physics for Kids', subtitle: 'Basic concepts in physics explained', image: 'https://www.shutterstock.com/image-photo/diverse-kindergarten-students-learning-energy-600nw-665608819.jpg', url: 'https://www.ducksters.com/science/physics/' },
    { id: '2', title: 'Chemistry Fun', subtitle: 'Easy chemistry experiments', image: 'https://www.shutterstock.com/image-photo/happy-african-american-boy-doing-600nw-2341122161.jpg', url: 'https://www.acs.org/education/whatischemistry/adventures-in-chemistry/experiments.html' },
    { id: '3', title: 'Biology Basics', subtitle: 'Learn about ecosystems', image: 'https://as1.ftcdn.net/v2/jpg/03/86/43/10/1000_F_386431001_pHkEmBZlO2n3FbObDy1Mt0TcnS2mYObE.jpg', url: 'https://www.ducksters.com/science/biology/' },
    { id: '4', title: 'Space Exploration', subtitle: 'Explore the universe', image: 'https://media.istockphoto.com/id/1488520939/photo/boy-in-space.jpg?s=612x612&w=0&k=20&c=0LL-F7VC8LkBqXB7XfqO8s2H6vnFWDpOXQl77LcY_sc=', url: 'https://kids.britannica.com/kids/article/space-exploration/353794' },
    { id: '5', title: 'The Scientific Method', subtitle: 'Understanding science processes', image: 'https://media.istockphoto.com/id/1255787263/photo/family-testing-volcano-school-project-in-back-yard.jpg?s=612x612&w=0&k=20&c=xNLglUqcAzHBDnXV8z2aAgcshtr6LxiCQRO2GyaBbNY=', url: 'https://littlebinsforlittlehands.com/using-scientific-method-experiments-kids/' },
  ];

  const englishResources = [
    { id: '1', title: 'Grammar Essentials', subtitle: 'Key grammar rules', image: 'https://media.istockphoto.com/id/1138365810/photo/school-kids-sitting-on-cushions-and-studying-over-books-in-a-library.jpg?s=612x612&w=0&k=20&c=uqg8bjfS6nX1modNiZD2C02HTtvc3JgDncR6woR5diM=', url: 'https://www.scholastic.com/parents/school-success/homework-help/learn-a-subject/parent-primer-grammar.html' },
    { id: '2', title: 'Creative Writing Tips', subtitle: 'Develop your writing skills', image: 'https://media.istockphoto.com/id/1370729539/vector/books-of-imagination-surreal-art-fantasy-painting-concept-idea-of-education-dream-and-reading.jpg?s=612x612&w=0&k=20&c=29KtW7u2Q-ejdYsOatBYn9E3kVVLCQ4eOZW1JE6FZWk=', url: 'https://www.nightzookeeper.com/blog/articles/creative-writing-for-kids-step-by-step' },
    { id: '3', title: 'Reading Comprehension', subtitle: 'Improve understanding', image: 'https://media.istockphoto.com/id/1472538772/photo/bored-shoolboy-keeping-open-book-on-head-in-classroom.jpg?s=612x612&w=0&k=20&c=q9BUJ-LVj_JJtJH-m8ABQMpChuc4f8HZt53hpV95C2s=', url: 'https://www.k5learning.com/reading-comprehension-worksheets' },
    { id: '4', title: 'Shakespeare Basics', subtitle: 'Introduction to Shakespeare', image: 'https://t4.ftcdn.net/jpg/05/95/83/67/360_F_595836741_8hyycaWwQphpA0vaMsuoce7tRr8xPKtP.jpg', url: 'https://www.folger.edu/explore/shakespeare-for-kids/' },
    { id: '5', title: 'Poetry for Beginners', subtitle: 'Learn to write poetry', image: 'https://media.istockphoto.com/id/1324608307/photo/cute-teen-boy-writing-something-outside-of-school.jpg?s=612x612&w=0&k=20&c=AD1c-hF41DVNCVtu44OPD8mB8kuVrJfq0TUHN-mlPsE=', url: 'https://poetry4kids.com/' },
  ];

  const historyResources = [
    { id: '1', title: 'World War II Overview', subtitle: 'Major events of WWII', image: 'https://as1.ftcdn.net/v2/jpg/01/09/26/14/1000_F_109261488_Smexn8WjeSTGJX24800rzjj4VyePEDZX.jpg', url: 'https://www.natgeokids.com/uk/discover/history/general-history/world-war-two/' },
    { id: '2', title: 'Ancient Civilizations', subtitle: 'History of Rome, Egypt, and Greece', image: 'https://media.istockphoto.com/id/1367243278/photo/the-boy-in-hat-sits-in-front-of-the-sphinx-and-looks-at-it.jpg?s=612x612&w=0&k=20&c=JKJ_3KImjdU3gi2EtI48PBehuupimhSDlge9A-b0sHE=', url: 'https://kids.britannica.com/students/article/ancient-civilization/272856' },
    { id: '3', title: 'American Revolution', subtitle: 'The birth of the USA', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH46cSk39Zaq9YxKF8GLGUp5Dk6KbWtXxSr0ZLkEqkJLOGjYutbZVJ_m8siAbQS1-9aaw&usqp=CAU', url: 'https://kids.britannica.com/kids/article/American-Revolution/353711' },
    { id: '4', title: 'History of Democracy', subtitle: 'From Ancient Greece to modern times', image: 'https://us.123rf.com/450wm/peopleimages12/peopleimages122301/peopleimages12230138595/197512351-we-are-the-people-that-will-better-the-future-elementary-school-children-in-class.jpg?ver=6', url: 'https://kids.britannica.com/students/article/democracy/273962' },
    { id: '5', title: 'The Renaissance', subtitle: 'A rebirth of art and culture', image: 'https://cdn2.picryl.com/photo/1550/12/31/lucas-cranach-christus-segnet-die-kinder-nationalgalerie-in-prag-a8f98e-1024.jpg', url: 'https://www.ducksters.com/history/renaissance.php' },
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

const CustomHeaderTitle = () => {
  return (
    <View style={styles.headerTitleContainer}>
      <Text style={[styles.headerLetter, { color: '#5BFF9F' }]}>a</Text>
      <Text style={[styles.headerLetter, { color: '#AE5BFF' }]}>P</Text>
      <Text style={[styles.headerLetter, { color: '#FF6D5B' }]}>a</Text>
      <Text style={[styles.headerLetter, { color: '#FFC85B' }]}>r</Text>
      <Text style={[styles.headerLetter, { color: '#5DEFFF' }]}>e</Text>
      <Text style={[styles.headerLetter, { color: '#AE5BFF' }]}>n</Text>
      <Text style={[styles.headerLetter, { color: '#AE5BFF' }]}>t</Text>
    </View>
  );
};


const ResourcesScreen = () => {
  const parentAvatar = 'https://static1.thegamerimages.com/wordpress/wp-content/uploads/2022/01/Emo.png';

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen
        name="Resources"
        component={ResourcesScreenContent}
        options={{
          headerStyle: {
            height: 140,
          },
          headerTitle: () => <CustomHeaderTitle />,
          headerRight: () => (
            <TouchableOpacity style={styles.avatarContainer} onPress={() => console.log('Avatar clicked')}>
              <Image source={{ uri: parentAvatar }} style={styles.avatar} />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer.Navigator>
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
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    width: 320,
    alignItems: 'flex-start',
    height: 220,
  },
  cardImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginTop: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 17,
    color: '#666',
    textAlign: 'left',
    marginBottom: 8,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLetter: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'BalsamiqSans_400Regular',
  },
});

export default ResourcesScreen;