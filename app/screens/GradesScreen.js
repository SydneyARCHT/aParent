import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { List, Divider, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig'; // Firebase config

// Array of colors based on the provided list
const iconColors = ['#5BFF9F', '#AE5BFF', '#FF6D5B', '#FFC85B', '#5DEFFF', '#AE5BFF', '#AE5BFF'];

function GradesScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const navigation = useNavigation(); 

  // Fetch parent, student, class, and grade data
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

        const classData = await Promise.all(classStudentSnapshot.docs.map(async classDocRef => {
          const classRef = classDocRef.data().class;
          const classDoc = await getDoc(classRef);

          if (classDoc.exists()) {
            // Step 4: Fetch the overall grade for each class
            const overallGrade = await fetchOverallGradeForClass(classRef, studentId);
            return { id: classDoc.id, className: classDoc.data().className, overallGrade };
          }

          return null;
        }));

        setClassData(classData.filter(item => item !== null));
      }
    } catch (error) {
      console.error('Error fetching classes and grades: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch and calculate overall grade for a class
  const fetchOverallGradeForClass = async (classRef, studentId) => {
    try {
      // Get assignments for the class
      const assignments = await getAssignmentsForClass(classRef.id);

      // If no assignments exist, return 0 as the overall grade
      if (assignments.length === 0) {
        return '0';
      }

      // Query to get all grades for the student in this class
      const gradesQuery = query(
        collection(database, 'grades'),
        where('student', '==', doc(database, 'students', studentId)),
        where('assignment', 'in', assignments)
      );

      const gradesSnapshot = await getDocs(gradesQuery);

      // Calculate the overall average
      const gradeItems = gradesSnapshot.docs.map(doc => doc.data());
      const totalGrades = gradeItems.reduce((acc, item) => acc + (Number(item.grade) || 0), 0);

      // Return 0 if there are no grades, otherwise calculate the average
      const overallGrade = gradeItems.length > 0 ? (totalGrades / gradeItems.length).toFixed(2) : '0';

      return overallGrade;
    } catch (error) {
      console.error('Error fetching overall grade: ', error);
      return '0'; // Return 0 in case of any errors
    }
  };

  // Function to get assignments for the class
  const getAssignmentsForClass = async (classId) => {
    const assignmentsQuery = query(collection(database, 'assignments'), where('class', '==', doc(database, 'classes', classId)));
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    return assignmentsSnapshot.docs.map(doc => doc.ref);
  };

  useEffect(() => {
    fetchClassesAndGrades();
  }, []);

  const renderItem = ({ item, index }) => (
    <>
      <List.Item
        title={item.className} 
        titleStyle={{ fontSize: 20 }}
        right={() => <Text style={styles.grade}>{item.overallGrade}%</Text>} // Display the overall grade
        left={() => (
          <List.Icon 
            icon="school" 
            size={60}
            color={iconColors[index % iconColors.length]} // Assign color based on index
            style={styles.icon} // Larger icon style
          />
        )} 
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

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  grade: {
    fontSize: 20, // Increased font size for grade percentage
    alignSelf: 'center',
    paddingRight: 15,
  },
  icon: {

  },
  listItem: {
    marginLeft: 10,
  },
});

export default GradesScreen;
