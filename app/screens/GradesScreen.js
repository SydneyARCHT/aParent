import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { List, Divider, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Import navigation
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig'; // Firebase config

// Function to generate random color for the hat icon
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to generate a random grade as a placeholder
const getRandomGrade = () => {
  return Math.floor(Math.random() * (100 - 70 + 1)) + 70 + '%'; // Random number between 70% and 100%
};

function GradesScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const navigation = useNavigation(); // Use navigation

  // Fetch parent, student, and class data
  const fetchClassesAndGrades = async () => {
    try {
      const user = auth.currentUser; // Get the current authenticated user
      if (!user) return;

      // Step 1: Fetch parent based on the logged-in user's email
      const userQuery = query(collection(database, 'users'), where('email', '==', user.email));
      const userSnapshot = await getDocs(userQuery);
      if (userSnapshot.empty) return;
      const userDoc = userSnapshot.docs[0];
      const parentId = userDoc.id;

      // Step 2: Fetch the student associated with this parent
      const parentRef = doc(database, 'parents', parentId);
      const parentStudentQuery = query(collection(database, 'parent_student'), where('parent', '==', parentRef));
      const parentStudentSnapshot = await getDocs(parentStudentQuery);

      if (parentStudentSnapshot.empty) return;
      const studentRefs = parentStudentSnapshot.docs.map(doc => doc.data().student);

      if (studentRefs.length > 0) {
        const studentId = studentRefs[0].id; // Assuming one student for now
        setStudentId(studentId);

        // Step 3: Fetch the classes associated with the student
        const classStudentQuery = query(collection(database, 'class_student'), where('student', '==', studentRefs[0]));
        const classStudentSnapshot = await getDocs(classStudentQuery);

        const classRefs = classStudentSnapshot.docs.map(doc => doc.data().class);
        const classData = await Promise.all(classRefs.map(async classRef => {
          const classDoc = await getDoc(classRef);
          return classDoc.exists() ? { id: classDoc.id, ...classDoc.data() } : null;
        }));

        setClassData(classData);
      }
    } catch (error) {
      console.error('Error fetching classes and grades: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndGrades();
  }, []);

  const renderItem = ({ item }) => (
    <>
      <List.Item
        title={item.className} // Display class name
        right={() => <Text style={styles.grade}>{getRandomGrade()}</Text>} // Placeholder for grade
        left={() => <List.Icon icon="school" color={getRandomColor()} />} // Random colored hat icon
        onPress={() => navigation.navigate('GradeItems', { classId: item.id, studentId })} // Navigate to GradeItemsScreen with classId and studentId
        style={styles.listItem}
      />
      <Divider />
    </>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#e91e63" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={classData}
          keyExtractor={(item) => item.id}
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
