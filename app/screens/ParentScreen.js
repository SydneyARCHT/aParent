import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';
import DrawerComponent from '../navigation/DrawerComponent';
import CardComponent from '../components/CardComponent';
import MessageCardComponent from '../components/MessageCardComponent';
import GradeCardComponent from '../components/GradeCardComponent';
import AttendanceCardComponent from '../components/AttendanceCardComponent';

const Drawer = createDrawerNavigator();

function ParentScreenContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [parentId, setParentId] = useState(null);

  // Fetch data function moved outside of useEffect
  const fetchData = async () => {
    if (!parentId) return;

    try {
      const parentDocRef = doc(database, 'parents', parentId);
      const parentStudentQuery = query(collection(database, 'parent_student'), where('parent', '==', parentDocRef));
      const parentStudentSnapshot = await getDocs(parentStudentQuery);
      const studentRefs = parentStudentSnapshot.docs.map(doc => doc.data().student).filter(ref => ref);

      if (studentRefs.length === 0) {
        console.log('No students found for this parent.');
        setCombinedData([]);
        return;
      }

      // Fetch class references
      const classStudentQuery = query(collection(database, 'class_student'), where('student', 'in', studentRefs));
      const classStudentSnapshot = await getDocs(classStudentQuery);
      const classRefs = classStudentSnapshot.docs.map(doc => doc.data().class).filter(ref => ref);

      if (classRefs.length === 0) {
        console.log('No classes found for these students.');
        setCombinedData([]);
        return;
      }

      // Fetch assignments
      const assignmentsQuery = query(
        collection(database, 'assignments'),
        where('class', 'in', classRefs),
        orderBy('date_created', 'desc')
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const assignments = assignmentsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'assignment',
        timestamp: doc.data().date_created || { seconds: 0, nanoseconds: 0 }
      }));

      // Fetch messages
      const chatsQuery = query(collection(database, 'chats'), where('parent_id', '==', parentDocRef));
      const chatsSnapshot = await getDocs(chatsQuery);
      const allMessages = [];

      for (const chatDoc of chatsSnapshot.docs) {
        const messagesQuery = query(
          collection(database, 'chats', chatDoc.id, 'messages'),
          orderBy('timestamp', 'desc')
        );
        const messagesSnapshot = await getDocs(messagesQuery);

        const newMessages = await Promise.all(messagesSnapshot.docs.map(async doc => {
          const messageData = doc.data();
          let senderName = 'Unknown';

          if (messageData.sender_type === 'teacher' || messageData.sender_type === 'parent') {
            const senderDoc = await getDoc(messageData.sender_id);
            if (senderDoc.exists()) {
              senderName = senderDoc.data().name;
            }
          }

          return {
            ...messageData,
            id: doc.id,
            title: `New message from - ${senderName}`,
            type: 'message',
            timestamp: messageData.timestamp || { seconds: 0, nanoseconds: 0 }
          };
        }));

        allMessages.push(...newMessages);
      }

      // Fetch grades
      const gradesQuery = query(collection(database, 'grades'), where('student', 'in', studentRefs));
      const gradesSnapshot = await getDocs(gradesQuery);
      const newGrades = await Promise.all(gradesSnapshot.docs.map(async doc => {
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
          timestamp: gradeData.timestamp || { seconds: 0, nanoseconds: 0 }
        };
      }));

      // Fetch attendance
      const attendanceQuery = query(collection(database, 'attendance'), where('student', 'in', studentRefs));
      const attendanceSnapshot = await getDocs(attendanceQuery);
      const newAttendance = await Promise.all(attendanceSnapshot.docs.map(async doc => {
        const attendanceData = doc.data();
        const studentDoc = await getDoc(attendanceData.student);
        const classDoc = await getDoc(attendanceData.class);

        return {
          ...attendanceData,
          id: doc.id,
          type: 'attendance',
          studentName: studentDoc.exists() ? studentDoc.data().name : 'Unknown Student',
          className: classDoc.exists() ? classDoc.data().name : 'Unknown Class',
          on_time: attendanceData.on_time,
          timestamp: attendanceData.timestamp || { seconds: 0, nanoseconds: 0 }
        };
      }));

      // Combine all fetched data
      const allData = [...assignments, ...allMessages, ...newGrades, ...newAttendance].sort((a, b) => {
        const aTimestamp = a.timestamp && a.timestamp.toDate ? a.timestamp.toDate().getTime() : 0;
        const bTimestamp = b.timestamp && b.timestamp.toDate ? b.timestamp.toDate().getTime() : 0;
        return bTimestamp - aTimestamp;
      });

      setCombinedData(allData);

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [parentId]);

  useEffect(() => {
    const fetchParentId = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log('User:', user);
        const userQuery = query(collection(database, 'users'), where('email', '==', user.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          console.log('User Data:', userData);
          if (userData.userType === 'parent') {
            setParentId(userDoc.id);
            console.log('Parent ID:', userDoc.id);
          }
        }
      }
    };

    fetchParentId();
  }, []);

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
          {combinedData.map((item, index) => (
            item.type === 'assignment' ? (
              <CardComponent key={index} data={item} />
            ) : item.type === 'message' ? (
              <MessageCardComponent key={index} data={item} />
            ) : item.type === 'grade' ? (
              <GradeCardComponent key={index} data={item} />
            ) : (
              <AttendanceCardComponent key={index} data={item} />
            )
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ParentScreen = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
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
