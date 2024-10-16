// ParentScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Modal,
  Image,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';
import CardComponent from '../components/CardComponent';
import MessageCardComponent from '../components/MessageCardComponent';
import GradeCardComponent from '../components/GradeCardComponent';
import AttendanceCardComponent from '../components/AttendanceCardComponent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerComponent from '../navigation/DrawerComponent';
import { CalendarList } from 'react-native-calendars';
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';

const Drawer = createDrawerNavigator();
const bubbleColors = [
  '#5BFF9F',
  '#AE5BFF',
  '#FF6D5B',
  '#FFC85B',
  '#5DEFFF',
];

const handleLayout = () => {
  setCalendarVisible(true); // Force rendering after layout is triggered
};

// Helper function to generate random bubbles


const generateRandomBubbles = (count) => {
  return Array.from({ length: count }).map((_, index) => {
    return <AnimatedBubble key={index} />;
  });
};

const AnimatedBubble = () => {
  const { width, height } = Dimensions.get("window");
  const size = Math.random() * 100 + 50; // Random size between 50 and 150
  const backgroundColor =
    bubbleColors[Math.floor(Math.random() * bubbleColors.length)] + "50"; // Random color with transparency

  // Generate a random starting position
  const initialX = Math.random() * width;
  const initialY = Math.random() * height;
  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  useEffect(() => {
    const moveBubble = () => {
      // Generate a random destination for each bubble movement
      const destinationX = Math.random() * width;
      const destinationY = Math.random() * height;

      Animated.loop(
        Animated.timing(position, {
          toValue: {
            x: destinationX,
            y: destinationY,
          },
          duration: Math.random() * 15000 + 5000, // Random duration between 3s and 7s
          useNativeDriver: false,
        }),
        {
          iterations: -1, // Infinite loop
        }
      ).start();
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

function ParentScreenContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendar modal and filter states
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // Filter menu state
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    notSeen: false,
    assignments: true,
    grades: true,
    messages: true,
    attendance: true,
  });



  // Callback to handle seen updates from MessageCardComponent
  const handleSeenUpdate = (messageId) => {
    setCombinedData((prevData) =>
      prevData.map((item) =>
        item.id === messageId ? { ...item, seen: true } : item
      )
    );
  };



  const fetchData = async () => {
    if (!parentId) return;

    try {
      const parentDocRef = doc(database, 'parents', parentId);
      const parentStudentQuery = query(
        collection(database, 'parent_student'),
        where('parent', '==', parentDocRef)
      );
      const parentStudentSnapshot = await getDocs(parentStudentQuery);
      const studentRefs = parentStudentSnapshot.docs
        .map((doc) => doc.data().student)
        .filter((ref) => ref);

      if (studentRefs.length === 0) {
        setCombinedData([]);
        setLoading(false);
        return;
      }

      const classStudentQuery = query(
        collection(database, 'class_student'),
        where('student', 'in', studentRefs)
      );
      const classStudentSnapshot = await getDocs(classStudentQuery);
      const classRefs = classStudentSnapshot.docs
        .map((doc) => doc.data().class)
        .filter((ref) => ref);

      if (classRefs.length === 0) {
        setCombinedData([]);
        setLoading(false);
        return;
      }

      // Fetch Assignments
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
          const className = classDoc.exists()
            ? classDoc.data().className
            : 'Unknown Class';

          const assignmentType = assignmentData.type || 'Assignment';

          // Assuming each assignment is linked to a student, adjust if necessary
          const studentDoc = await getDoc(studentRefs[0]);
          const studentName = studentDoc.exists()
            ? studentDoc.data().name
            : 'Your child';

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
            timestamp: assignmentData.date_created || {
              seconds: 0,
              nanoseconds: 0,
            },
          };
        })
      );

      // Fetch Messages
      const chatsQuery = query(
        collection(database, 'chats'),
        where('parent_id', '==', parentDocRef)
      );
      const chatsSnapshot = await getDocs(chatsQuery);
      const chatIds = chatsSnapshot.docs.map((doc) => doc.id);

      let messages = [];
      for (const chatId of chatIds) {
        const messagesQuery = query(
          collection(database, `chats/${chatId}/messages`),
          where('receiver_id', '==', parentDocRef),
          orderBy('timestamp', 'desc')
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        messages = messages.concat(
          messagesSnapshot.docs.map((doc) => {
            const messageData = doc.data();

            return {
              ...messageData,
              id: doc.id,
              chatId: chatId,
              type: 'message',
              title: `New message from ${
                messageData.sender_type === 'teacher' ? 'Teacher' : 'Parent'
              }`,
              timestamp: messageData.timestamp || {
                seconds: 0,
                nanoseconds: 0,
              },
            };
          })
        );
      }

      // Fetch Grades
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
            studentName: studentDoc.exists()
              ? studentDoc.data().name
              : 'Unknown Student',
            assignmentName: assignmentDoc.exists()
              ? assignmentDoc.data().name
              : 'Unknown Assignment',
            grade: gradeData.grade,
            feedback: gradeData.feedback,
            timestamp: gradeData.timestamp || {
              seconds: 0,
              nanoseconds: 0,
            },
          };
        })
      );

      // Fetch Attendance
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
            studentName: studentDoc.exists()
              ? studentDoc.data().name
              : 'Unknown Student',
            className: classDoc.exists()
              ? classDoc.data().className
              : 'Unknown Class',
            status: status,
            timestamp: attendanceData.timestamp || {
              seconds: 0,
              nanoseconds: 0,
            },
            seen: attendanceData.seen || false,
          };
        })
      );

      const allData = [
        ...assignments,
        ...messages,
        ...newGrades,
        ...newAttendance,
      ].sort((a, b) => {
        const aTimestamp =
          a.timestamp && a.timestamp.seconds
            ? a.timestamp.seconds * 1000
            : 0;
        const bTimestamp =
          b.timestamp && b.timestamp.seconds
            ? b.timestamp.seconds * 1000
            : 0;
        return bTimestamp - aTimestamp;
      });

      setCombinedData(allData);
      setFilteredData(allData); // Apply filter logic after fetching the data
    } catch (error) {
      console.error('Error fetching data: ', error);
      Alert.alert('Error', 'There was an error fetching your data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchParentId = async () => {
      const user = auth.currentUser;
      if (user) {
        const userQuery = query(
          collection(database, 'users'),
          where('email', '==', user.email)
        );
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
    if (parentId) {
      fetchData();
    }
  }, [parentId]);

  const applyTypeFilter = () => {
    let filtered = combinedData;

    // Apply date filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.timestamp.seconds * 1000);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Apply 'Not Seen' filtering
    if (selectedFilters.notSeen) {
      filtered = filtered.filter((item) => !item.seen);
    }

    // Apply type filtering
    const typesToShow = [];
    if (selectedFilters.assignments) typesToShow.push('assignment');
    if (selectedFilters.grades) typesToShow.push('grade');
    if (selectedFilters.messages) typesToShow.push('message');
    if (selectedFilters.attendance) typesToShow.push('attendance');

    filtered = filtered.filter((item) => typesToShow.includes(item.type));

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyTypeFilter();
  }, [selectedFilters, startDate, endDate, combinedData]);

  const onFilterChange = (filterKey) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey],
    }));
  };

  const handleDayPress = (day) => {
    if (!startDate) {
      setStartDate(day.dateString);
    } else if (!endDate) {
      setEndDate(day.dateString);
    } else {
      // Reset dates if both are already selected
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };

  const applyFilter = () => {
    setCalendarVisible(false);
    applyTypeFilter(); // Apply the filter once date range is selected
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#e91e63"
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {generateRandomBubbles(20)}
      </View>

      {/* Filter Icon */}
      <TouchableOpacity
        style={styles.filterIcon}
        onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}
      >
        <MaterialIcons name="filter-list" size={40} color="#e91e63" />
      </TouchableOpacity>

      {/* Filter Dropdown */}
      {filterDropdownVisible && (
        <View style={styles.filterDropdownContainer}>
          <View style={styles.filterItem}>
            <FontAwesome5 name="eye" size={16} color="green" />
            <Text style={styles.filterText}>Not Seen</Text>
            <TouchableOpacity onPress={() => onFilterChange('notSeen')}>
              <FontAwesome
                name={selectedFilters.notSeen ? 'check-square' : 'square-o'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.filterItem}>
            <FontAwesome5 name="book" size={16} color="#FF6D5B" />
            <Text style={styles.filterText}>Assignments</Text>
            <TouchableOpacity onPress={() => onFilterChange('assignments')}>
              <FontAwesome
                name={selectedFilters.assignments ? 'check-square' : 'square-o'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.filterItem}>
            <FontAwesome5 name="file-alt" size={16} color="#AE5BFF" />
            <Text style={styles.filterText}>Grades</Text>
            <TouchableOpacity onPress={() => onFilterChange('grades')}>
              <FontAwesome
                name={selectedFilters.grades ? 'check-square' : 'square-o'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.filterItem}>
            <FontAwesome5 name="comments" size={16} color="#5DEFFF" />
            <Text style={styles.filterText}>Messages</Text>
            <TouchableOpacity onPress={() => onFilterChange('messages')}>
              <FontAwesome
                name={selectedFilters.messages ? 'check-square' : 'square-o'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.filterItem}>
            <Feather name="check-circle" size={16} color="#5BFF9F" />
            <Text style={styles.filterText}>Attendance</Text>
            <TouchableOpacity onPress={() => onFilterChange('attendance')}>
              <FontAwesome
                name={
                  selectedFilters.attendance ? 'check-square' : 'square-o'
                }
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Date Range Button */}
      <TouchableOpacity
        style={styles.neumorphicButton}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.buttonText}>Select Date Range</Text>
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal
        visible={calendarVisible}
        animationType="slide"
        transparent={true}
        
        onRequestClose={() => setCalendarVisible(false)}
        onLayout={handleLayout}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setCalendarVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select A Date Range</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <CalendarList
                horizontal={true}
                pagingEnabled={true}
                calendarWidth={350}
                calendarHeight={200}
                minDate={'2024-08-01'}
                maxDate={'2025-05-31'}
                pastScrollRange={2}
                futureScrollRange={9}
                showScrollIndicator={true}
                onDayPress={handleDayPress}
                markedDates={{
                  ...(startDate && {
                    [startDate]: {
                      selected: true,
                      startingDay: true,
                      color: 'green',
                    },
                  }),
                  ...(endDate && {
                    [endDate]: {
                      selected: true,
                      endingDay: true,
                      color: 'red',
                    },
                  }),
                }}
                style={styles.calendarStyle}
              />
              <View style={styles.datePickerContainer}>
                <View style={styles.dateTextContainer}>
                  <Text style={styles.dateLabel}>Start Date:</Text>
                  <Text style={styles.dateValue}>
                    {startDate || 'Not Selected'}
                  </Text>
                </View>
                <View style={styles.dateTextContainer}>
                  <Text style={styles.dateLabel}>End Date:</Text>
                  <Text style={styles.dateValue}>
                    {endDate || 'Not Selected'}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  <Text style={styles.clearButtonText}>Clear Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={applyFilter}
                >
                  <Text style={styles.applyButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Main content */}
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
          {filteredData.map((item, index) =>
            item.type === 'assignment' ? (
              <CardComponent key={item.id} data={item} />
            ) : item.type === 'message' ? (
              <MessageCardComponent
                key={item.id}
                data={item}
                onSeenUpdate={handleSeenUpdate}
              />
            ) : item.type === 'grade' ? (
              <GradeCardComponent key={item.id} data={item} />
            ) : item.type === 'attendance' ? (
              <AttendanceCardComponent key={item.id} data={item} />
            ) : null
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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

const ParentScreen = () => {
  const parentAvatar = 'https://static1.thegamerimages.com/wordpress/wp-content/uploads/2022/01/Emo.png';

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={ParentScreenContent}
        options={{
          headerStyle: {
            height: 140,
          },
          headerTitle: () => <CustomHeaderTitle />,
          headerRight: () => (
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => console.log('Avatar clicked')}
            >
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
    backgroundColor: 'transparent',
  },
  scrollViewContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
  },
  filterIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  filterDropdownContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    width: 180,
    borderRadius: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  neumorphicButton: {
    backgroundColor: '#e91e63',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    minHeight: '70%',
    maxHeight: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e91e63',
    marginBottom: 10,
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 110,
  },
  calendarStyle: {
    marginBottom: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  dateTextContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  dateValue: {
    fontSize: 16,
    color: '#e91e63',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  clearButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#e91e63',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bubble: {
    position: 'absolute',
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
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default ParentScreen;
