import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView, RefreshControl, Text } from "react-native";
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';
import CardComponent from '../components/CardComponent';
import MessageCardComponent from '../components/MessageCardComponent';
import GradeCardComponent from '../components/GradeCardComponent';
import AttendanceCardComponent from '../components/AttendanceCardComponent';

function AttendanceScreen() {
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  const [combinedData, setCombinedData] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchParentId(); // Get the parent ID initially
  }, []);

  useEffect(() => {
    if (parentId) {
      fetchData();
    }
  }, [parentId, startDate, endDate]);

  const fetchParentId = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userQuery = query(collection(database, 'users'), where('email', '==', user.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          if (userData.userType === 'parent') {
            setParentId(userDoc.id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching parent ID:", error);
    }
  };

  const fetchData = async () => {
    if (!parentId) return;

    try {
      const parentDocRef = doc(database, 'parents', parentId);
      const parentStudentQuery = query(collection(database, 'parent_student'), where('parent', '==', parentDocRef));
      const parentStudentSnapshot = await getDocs(parentStudentQuery);
      const studentRefs = parentStudentSnapshot.docs.map(doc => doc.data().student).filter(ref => ref);

      if (studentRefs.length === 0) {
        setCombinedData([]);
        return;
      }

      // Fetch class references
      const classStudentQuery = query(collection(database, 'class_student'), where('student', 'in', studentRefs));
      const classStudentSnapshot = await getDocs(classStudentQuery);
      const classRefs = classStudentSnapshot.docs.map(doc => doc.data().class).filter(ref => ref);

      if (classRefs.length === 0) {
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


      const allData = [...assignments, ...newGrades, ...newAttendance];

      const filteredData = allData.filter((item) => {
        if (!item.timestamp) return false;
        const itemDate = new Date(item.timestamp.seconds * 1000); 
        return (
          (!startDate || itemDate >= new Date(startDate)) &&
          (!endDate || itemDate <= new Date(endDate))
        );
      });

      setCombinedData(filteredData);

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleDayPress = (day) => {
    if (selectingStartDate) {
      setStartDate(day.dateString);
      setSelectingStartDate(false);
    } else {
      if (moment(day.dateString).isBefore(startDate)) {
        setStartDate(day.dateString);
        setEndDate(null);
      } else {
        setEndDate(day.dateString);
        setSelectingStartDate(true);
      }
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
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
        <CalendarList
          ref={calendarRef}
          horizontal={true}
          pagingEnabled={true}
          calendarWidth={360}
          minDate={'2024-08-01'}
          maxDate={'2025-05-31'}
          pastScrollRange={2}
          futureScrollRange={9}
          showScrollIndicator={true}
          onDayPress={handleDayPress}
          markedDates={{
            ...(startDate && { [startDate]: { selected: true, startingDay: true, color: 'green' } }),
            ...(endDate && { [endDate]: { selected: true, endingDay: true, color: 'red' } }),
          }}
        />
        <View style={styles.datePickerContainer}>
          <Text>Start Date: {startDate || "Not Selected"}</Text>
          <Text>End Date: {endDate || "Not Selected"}</Text>
        </View>
        <View style={styles.cardsContainer}>
          {combinedData.map((item, index) => (
            item.type === 'assignment' ? (
              <CardComponent key={index} data={item} />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 16,
  },
  datePickerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    padding: 16,
  },
});

export default AttendanceScreen;
