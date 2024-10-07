import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { collection, collectionGroup, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';
import CardComponent from '../components/CardComponent';
import MessageCardComponent from '../components/MessageCardComponent';
import GradeCardComponent from '../components/GradeCardComponent';
import AttendanceCardComponent from '../components/AttendanceCardComponent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerComponent from '../navigation/DrawerComponent';

const Drawer = createDrawerNavigator();

function ParentScreenContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [parentId, setParentId] = useState(null);

  // Function to fetch data for the parent (assignments, messages, grades, attendance)
  const fetchData = async () => {
    if (!parentId) return;

    try {
      const parentDocRef = doc(database, 'parents', parentId);
      console.log('Parent Document Reference: ', parentDocRef);

      // Get students associated with the parent
      const parentStudentQuery = query(
        collection(database, 'parent_student'),
        where('parent', '==', parentDocRef)
      );
      const parentStudentSnapshot = await getDocs(parentStudentQuery);
      const studentRefs = parentStudentSnapshot.docs
        .map((doc) => doc.data().student)
        .filter((ref) => ref);
      console.log('Student References: ', studentRefs);

      if (studentRefs.length === 0) {
        console.log('No students found for this parent.');
        setCombinedData([]);
        return;
      }

      // Get class_student documents where student reference matches
      const classStudentQuery = query(
        collection(database, 'class_student'),
        where('student', 'in', studentRefs)
      );
      const classStudentSnapshot = await getDocs(classStudentQuery);
      const classRefs = classStudentSnapshot.docs
        .map((doc) => doc.data().class)
        .filter((ref) => ref);
      console.log('Class References: ', classRefs);

      if (classRefs.length === 0) {
        console.log('No classes found for these students.');
        setCombinedData([]);
        return;
      }

      // Fetch assignments for those classes
      const assignmentsQuery = query(
        collection(database, 'assignments'),
        where('class', 'in', classRefs),
        orderBy('date_created', 'desc')
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const assignments = await Promise.all(
        assignmentsSnapshot.docs.map(async (doc) => {
          const assignmentData = doc.data();
          const classDoc = await getDoc(assignmentData.class);
          const className = classDoc.exists() ? classDoc.data().className : 'Unknown Class';

          // Get the assignment type
          const assignmentType = assignmentData.type || 'Assignment';

          // Get the student name (assuming single student for simplicity)
          const studentDoc = await getDoc(studentRefs[0]);
          const studentName = studentDoc.exists() ? studentDoc.data().name : 'Your child';

          return {
            ...assignmentData,
            id: doc.id,
            type: 'assignment',
            assignmentName: assignmentData.name,
            className: className,
            assignmentType: assignmentType,
            studentName: studentName,
            description: assignmentData.description || '',
            date_assigned: assignmentData.date_assigned,
            due_date: assignmentData.due_date,
            timestamp: assignmentData.date_created || { seconds: 0, nanoseconds: 0 },
          };
        })
      );
      console.log('Assignments: ', assignments);

      // Fetch messages where the current parent is the receiver using collectionGroup
      const messagesQuery = query(
        collectionGroup(database, 'messages'),
        where('receiver_id', '==', parentDocRef),
        orderBy('timestamp', 'desc')
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages = messagesSnapshot.docs.map((doc) => {
        const messageData = doc.data();
        console.log('Message Data: ', messageData);
        return {
          ...messageData,
          id: doc.id,
          type: 'message',
          title: `New message from - ${
            messageData.sender_type === 'teacher' ? 'Teacher' : 'Parent'
          }`,
          timestamp: messageData.timestamp || { seconds: 0, nanoseconds: 0 },
        };
      });
      console.log('Messages: ', messages);

      // Fetch grades for those students
      const gradesQuery = query(
        collection(database, 'grades'),
        where('student', 'in', studentRefs)
      );
      const gradesSnapshot = await getDocs(gradesQuery);
      const newGrades = await Promise.all(
        gradesSnapshot.docs.map(async (doc) => {
          const gradeData = doc.data();
          const studentDoc = await getDoc(gradeData.student);
          const assignmentDoc = await getDoc(gradeData.assignment);

          return {
            ...gradeData,
            id: doc.id,
            type: 'grade',
            studentName: studentDoc.exists() ? studentDoc.data().name : 'Unknown Student',
            assignmentName: assignmentDoc.exists() ? assignmentDoc.data().name : 'Unknown Assignment',
            grade: gradeData.grade,
            feedback: gradeData.feedback,
            timestamp: gradeData.timestamp || { seconds: 0, nanoseconds: 0 },
          };
        })
      );
      console.log('Grades: ', newGrades);

      // Fetch attendance for those students
      const attendanceQuery = query(
        collection(database, 'attendance'),
        where('student', 'in', studentRefs)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      const newAttendance = await Promise.all(
        attendanceSnapshot.docs.map(async (doc) => {
          const attendanceData = doc.data();
          const studentDoc = await getDoc(attendanceData.student);
          const classDoc = await getDoc(attendanceData.class);

          // Map 'on_time' to a 'status' string
          let status = '';
          if (attendanceData.on_time === true) {
            status = 'on time';
          } else if (attendanceData.on_time === false) {
            status = 'late';
          } else {
            status = 'absent';
          }

          return {
            ...attendanceData,
            id: doc.id,
            type: 'attendance',
            studentName: studentDoc.exists() ? studentDoc.data().name : 'Unknown Student',
            className: classDoc.exists() ? classDoc.data().className : 'Unknown Class',
            status: status, // Include the status field
            timestamp: attendanceData.timestamp || { seconds: 0, nanoseconds: 0 },
          };
        })
      );
      console.log('Attendance: ', newAttendance);

      // Combine all fetched data
      const allData = [
        ...assignments,
        ...messages,
        ...newGrades,
        ...newAttendance,
      ].sort((a, b) => {
        const aTimestamp = a.timestamp && a.timestamp.seconds ? a.timestamp.seconds * 1000 : 0;
        const bTimestamp = b.timestamp && b.timestamp.seconds ? b.timestamp.seconds * 1000 : 0;
        return bTimestamp - aTimestamp;
      });

      console.log('Combined Data: ', allData);
      setCombinedData(allData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    const fetchParentId = async () => {
      const user = auth.currentUser;
      if (user) {
        const userQuery = query(collection(database, 'users'), where('email', '==', user.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          if (userData.userType === 'parent') {
            setParentId(userDoc.id);
            console.log('Parent ID set: ', userDoc.id);
          }
        }
      }
    };

    fetchParentId();
  }, []);

  useEffect(() => {
    if (parentId) {
      fetchData();
    }
  }, [parentId]);

  const removeItemById = (id) => {
    setCombinedData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#e91e63']}
          />
        }
      >
        <View style={styles.container}>
          {combinedData.map((item, index) =>
            item.type === 'assignment' ? (
              <CardComponent key={index} data={item} onClose={removeItemById} />
            ) : item.type === 'message' ? (
              <MessageCardComponent key={index} data={item} onClose={removeItemById} />
            ) : item.type === 'grade' ? (
              <GradeCardComponent key={index} data={item} onClose={removeItemById} />
            ) : item.type === 'attendance' ? (
              <AttendanceCardComponent key={index} data={item} onClose={removeItemById} />
            ) : null
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ParentScreen = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen name="Home" component={ParentScreenContent} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
  },
});

export default ParentScreen;
