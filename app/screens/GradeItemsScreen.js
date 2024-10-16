import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; 
import { DataTable } from 'react-native-paper'; 
import { database } from '../config/firebaseConfig'; // Firebase config

const screenWidth = Dimensions.get('window').width;

function GradeItemsScreen({ route }) {
  const { classId, studentId } = route.params; // Get classId and studentId from route
  const [loading, setLoading] = useState(true);
  const [gradeItems, setGradeItems] = useState([]);
  const [className, setClassName] = useState('');
  const [assignmentTypes, setAssignmentTypes] = useState([]);
  const [averageGrades, setAverageGrades] = useState([]);
  const [overallAverage, setOverallAverage] = useState(0); // Overall average of all grades
  const [filteredGradeItems, setFilteredGradeItems] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // For the modal

  useEffect(() => {
    fetchGrades(classId, studentId); // Fetch grades based on classId and studentId
  }, []);

  const fetchGrades = async (classId, studentId) => {
    try {
      // Step 1: Fetch the class-student relationship
      const classStudentQuery = query(
        collection(database, 'class_student'),
        where('class', '==', doc(database, 'classes', classId)),
        where('student', '==', doc(database, 'students', studentId))
      );
      const classStudentSnapshot = await getDocs(classStudentQuery);
      if (classStudentSnapshot.empty) {
        console.warn("No student found for this class.");
        return;
      }
  
      // Step 2: Fetch assignments for the class
      const assignments = await getAssignmentsForClass(classId);
  
      // Step 3: If no assignments exist, return early with no grades
      if (assignments.length === 0) {
        console.log("No assignments found for this class.");
        setFilteredGradeItems([]); // No grades to display
        setAssignmentTypes([]); // No assignment types
        setAverageGrades([]); // No averages
        setOverallAverage(0); // No overall average
        setClassName((await getDoc(doc(database, 'classes', classId))).data().className);
        setLoading(false);
        return;
      }
  
      // Step 4: Query for grades based on the assignments
      const gradesQuery = query(
        collection(database, 'grades'),
        where('student', '==', doc(database, 'students', studentId)),
        where('assignment', 'in', assignments) // Get assignments linked to this class
      );
      const gradesSnapshot = await getDocs(gradesQuery);
  
      const gradeData = await Promise.all(
        gradesSnapshot.docs.map(async (doc) => {
          const gradeDoc = doc.data();
          const assignmentDoc = await getDoc(gradeDoc.assignment);
          if (!assignmentDoc.exists()) return null;
  
          return {
            id: doc.id,
            ...gradeDoc,
            assignmentName: assignmentDoc.data().name,
            assignmentType: assignmentDoc.data().type,
            date: assignmentDoc.data().due_date.toDate(),
            feedback: gradeDoc.feedback,
            grade: gradeDoc.grade,
          };
        })
      );
      const validGrades = gradeData.filter(item => item !== null);
  
      // Extract assignment types
      const types = [...new Set(validGrades.map(item => item.assignmentType))];
      setAssignmentTypes(types);
      setFilteredGradeItems(validGrades);
  
      // Calculate average grades for each type
      const averages = calculateAverageGrades(validGrades, types);
      setAverageGrades(averages);
  
      // Calculate overall average
      const overallAvg = calculateOverallAverage(validGrades);
      setOverallAverage(overallAvg);
  
      setClassName((await getDoc(doc(database, 'classes', classId))).data().className);
      setGradeItems(validGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentsForClass = async (classId) => {
    const assignmentsQuery = query(collection(database, 'assignments'), where('class', '==', doc(database, 'classes', classId)));
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    return assignmentsSnapshot.docs.map(doc => doc.ref);
  };

  
  const calculateAverageGrades = (gradeItems, types) => {
    const averages = types.map(type => {
      const itemsOfType = gradeItems.filter(item => item.assignmentType === type);
      const totalGrades = itemsOfType.reduce((acc, item) => acc + item.grade, 0);
      return itemsOfType.length > 0 ? totalGrades / itemsOfType.length : 0; // Average
    });
    return averages;
  };

  // Corrected function to calculate the overall average of all grades
  const calculateOverallAverage = (gradeItems) => {
    const totalGrades = gradeItems.reduce((acc, item) => acc + item.grade, 0);
    
    const average = totalGrades / gradeItems.length;
    
    
    return gradeItems.length > 0 ? average.toFixed(2) : 0;
  };

  const handleTableRowClick = (item) => {
    setSelectedAssignment(item);
    setModalVisible(true); 
  };

  // Color assignment based on index
  const barColors = ['#5BFF9F', '#AE5BFF', '#FF6D5B', '#FFC85B', '#5DEFFF', '#AE5BFF', '#AE5BFF'];

  if (loading) {
    return <ActivityIndicator size="large" color="#e91e63" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.classTitle}>{className}</Text>
  
        {/* Bar Chart for Assignment Types */}
        {assignmentTypes.length > 0 ? (
          <View style={styles.barChartContainer}>
            {/* Y-Axis for grades */}
            <View style={styles.yAxis}>
              {[100, 80, 60, 40, 20, 0].map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>{label}</Text>
              ))}
            </View>
  
            {/* Bar chart content */}          
            <View style={styles.barChartContent}>
              {assignmentTypes.map((type, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={[styles.bar, { height: averageGrades[index] * 2, backgroundColor: barColors[index], width: 60 }]}>
                    <Text style={styles.barAverage}>{averageGrades[index].toFixed(1)}%</Text>
                  </View>
                  <Text style={styles.barLabel}>{type}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
  
        {/* Display Overall Average */}
        <Text style={styles.overallAverageTitle}>
          Overall Grade: {overallAverage}%
        </Text>
  
        {/* Modal for displaying assignment details */}
        <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.assignmentTitle}>{selectedAssignment?.assignmentName}</Text>
              <Text>Grade: {selectedAssignment?.grade}%</Text>
              <Text>Feedback: {selectedAssignment?.feedback}</Text>
              <Text>Type: {selectedAssignment?.assignmentType}</Text>
              <Text>Date: {selectedAssignment?.date.toLocaleDateString()}</Text>
              <Text style={styles.closeButton} onPress={() => setModalVisible(false)}>Close</Text>
            </View>
          </View>
        </Modal>
  
        {/* Display Grades Table or "No Grades To Display!" */}
        {filteredGradeItems.length > 0 ? (
          <DataTable style={styles.tableContainer}>
            <DataTable.Header>
              <DataTable.Title style={[styles.tableHeader, { flex: 4 }]}>Assignment</DataTable.Title>
              <DataTable.Title style={[styles.tableHeader, { flex: 1 }]}>Grade</DataTable.Title>
            </DataTable.Header>
  
            {filteredGradeItems.map((item) => (
              <DataTable.Row key={item.id} onPress={() => handleTableRowClick(item)}>
                <DataTable.Cell style={[styles.tableCell, { flex: 4 }]}>{item.assignmentName}</DataTable.Cell>
                <DataTable.Cell style={[styles.tableCell, { flex: 1 }]}>{item.grade}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        ) : (
          <View style={styles.noGradesContainer}>
            <Text style={styles.noGradesText}>No Grades To Display!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  classTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 20,
  },
  yAxis: {
    justifyContent: 'space-between',
    height: 200, 
    marginRight: 10,
    marginBottom: 22,
  },
  yAxisLabel: {
    fontSize: 12,
  },
  barChartContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bar: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 5,
  },
  barLabel: {
    marginTop: 5,
    fontSize: 18, // Increased the font size by 50%
    textAlign: 'center',
  },
  barAverage: {
    fontSize: 10,
    color: 'white',
    marginBottom: 5,
  },
  overallAverageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  assignmentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    fontSize: 16,
    color: '#e91e63',
    marginTop: 20,
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: 20, 
  },
  tableHeader: {
    fontSize: 12,
  },
  tableCell: {
    fontSize: 13, 
    marginTop: 10,
    flexWrap: 'wrap',
  },
});

export default GradeItemsScreen;
