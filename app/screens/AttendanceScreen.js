import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions, Text } from 'react-native';
import { ContributionGraph, PieChart } from 'react-native-chart-kit';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#ffffff",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(0, 127, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

function AttendanceScreen() {
  const [parentId, setParentId] = useState(null);
  const [studentName, setStudentName] = useState('Your child');
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    onTime: 0,
    late: 0,
    absent: 0,
    onTimePercentage: 0,
    latePercentage: 0,
    absentPercentage: 0,
  });

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
          }
        }
      }
    };

    fetchParentId();
  }, []);

  useEffect(() => {
    if (!parentId) return;

    const fetchAttendanceData = async () => {
      try {
        const parentDocRef = doc(database, 'parents', parentId);
        const parentStudentQuery = query(collection(database, 'parent_student'), where('parent', '==', parentDocRef));
        const parentStudentSnapshot = await getDocs(parentStudentQuery);
        const studentRefs = parentStudentSnapshot.docs.map(doc => doc.data().student).filter(ref => ref);

        if (studentRefs.length === 0) {
          console.log('No students found for this parent.');
          setAttendanceData([]);
          return;
        }

        // Get the student's name
        const studentDocRef = studentRefs[0];
        const studentSnap = await getDoc(studentDocRef);
        if (studentSnap.exists()) {
          setStudentName(studentSnap.data().name);
        }

        const attendanceQuery = query(collection(database, 'attendance'), where('student', 'in', studentRefs));
        const attendanceSnapshot = await getDocs(attendanceQuery);
        const attendanceMap = {};
        let onTimeCount = 0;
        let lateCount = 0;
        let absentCount = 0;

        // Fill attendance data by date
        attendanceSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const dateString = moment(data.date.toDate()).format('YYYY-MM-DD');
          const onTimeStatus = data.on_time;

          if (!attendanceMap[dateString]) {
            attendanceMap[dateString] = { date: dateString, count: 0 };
            absentCount++;
          }

          if (onTimeStatus) {
            attendanceMap[dateString].count = 2;
            onTimeCount++;
            absentCount--;
          } else if (attendanceMap[dateString].count !== 2) {
            attendanceMap[dateString].count = 1;
            lateCount++;
            absentCount--;
          }
        });

        const endDate = moment().endOf('month');
        const startDate = moment().subtract(3, 'months').startOf('month');
        const allDates = [];

        for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
          const dateString = m.format('YYYY-MM-DD');
          if (!attendanceMap[dateString]) {
            attendanceMap[dateString] = { date: dateString, count: 0 };
            absentCount++;
          }
          allDates.push(attendanceMap[dateString]);
        }

        setAttendanceData(allDates);

        // Set summary
        const totalDays = onTimeCount + lateCount + absentCount;
        setAttendanceSummary({
          onTime: onTimeCount,
          late: lateCount,
          absent: absentCount,
          onTimePercentage: ((onTimeCount / totalDays) * 100).toFixed(2),
          latePercentage: ((lateCount / totalDays) * 100).toFixed(2),
          absentPercentage: ((absentCount / totalDays) * 100).toFixed(2),
        });
      } catch (error) {
        console.error('Error fetching attendance data: ', error);
      }
    };

    fetchAttendanceData();
  }, [parentId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <ContributionGraph
            values={attendanceData}
            endDate={moment().endOf('month').toDate()}
            numDays={105}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="count"
          />
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryHeader}>Attendance Summary</Text>
            <View style={styles.cardWithShadow}>
              <Text style={styles.summaryText}>{`${studentName} has attended classes with the following record:`}</Text>
              <Text style={styles.summaryText}>{`On Time: ${attendanceSummary.onTime} times (${attendanceSummary.onTimePercentage}%)`}</Text>
              <Text style={styles.summaryText}>{`Late: ${attendanceSummary.late} times (${attendanceSummary.latePercentage}%)`}</Text>
              <Text style={styles.summaryText}>{`Absent: ${attendanceSummary.absent} times (${attendanceSummary.absentPercentage}%)`}</Text>
            </View>
          </View>
          <PieChart
            data={[
              {
                name: 'On Time',
                population: parseFloat(attendanceSummary.onTimePercentage),
                color: '#4CAF50',
                legendFontColor: '#333',
                legendFontSize: 14,
                legendFontStyle: 'normal',
              },
              {
                name: 'Late',
                population: parseFloat(attendanceSummary.latePercentage),
                color: '#FFC107',
                legendFontColor: '#333',
                legendFontSize: 14,
                legendFontStyle: 'normal',
              },
              {
                name: 'Absent',
                population: parseFloat(attendanceSummary.absentPercentage),
                color: '#F44336',
                legendFontColor: '#333',
                legendFontSize: 14,
                legendFontStyle: 'normal',
              },
            ]}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            center={[10, 0]}
          />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardWithShadow: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: '',
  },
});

export default AttendanceScreen;