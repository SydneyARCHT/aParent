import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions, Text, Animated } from 'react-native';
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

// Colors for the animated bubbles
const bubbleColors = ['#5BFF9F', '#AE5BFF', '#FF6D5B', '#FFC85B', '#5DEFFF'];

// Helper function to generate random bubbles
const generateRandomBubbles = (count) => {
  return Array.from({ length: count }).map((_, index) => {
    return <AnimatedBubble key={index} />;
  });
};

const AnimatedBubble = () => {
  const { width, height } = Dimensions.get('window');
  const size = Math.random() * 100 + 50; // Random size between 50 and 150
  const backgroundColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)] + '50'; // Random color with transparency

  // Generate a random starting position
  const initialX = Math.random() * width;
  const initialY = Math.random() * height;
  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  useEffect(() => {
    const moveBubble = () => {
      Animated.timing(position, {
        toValue: {
          x: position.x._value - Math.random() * 100 - 50, // Move leftward
          y: position.y._value - Math.random() * 100 - 50, // Move upward
        },
        duration: Math.random() * 4000 + 3000, // Random duration between 3s and 7s
        useNativeDriver: false,
      }).start(() => moveBubble()); // Start again for continuous movement
    };

    moveBubble();
  }, [position]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: size / 2,
          transform: position.getTranslateTransform(),
        },
      ]}
    />
  );
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
  const [backgroundAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [backgroundAnim]);

  const animatedBackgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F3E5F5', '#E8F5E9'],
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
    <Animated.View style={[styles.animatedBackground, { backgroundColor: animatedBackgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        {generateRandomBubbles(15)}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedBackground: {
    flex: 1,
  },
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
    textAlign: 'center',
  },
  bubble: {
    position: 'absolute',
  },
});

export default AttendanceScreen;