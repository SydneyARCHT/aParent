import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const GradeCardComponent = ({ data, onClose, onView }) => {
  const [elevationAnim] = React.useState(new Animated.Value(2));
  const [modalVisible, setModalVisible] = useState(false);
  const [teacherName, setTeacherName] = useState('Teacher');
  const [seen, setSeen] = useState(data.seen);

  useEffect(() => {
    const fetchTeacherName = async () => {
      if (data.teacher_id) {
        try {
          const db = getFirestore();
          const teacherPath = data.teacher_id.path;
          const teacherRef = doc(db, teacherPath);
          const teacherSnap = await getDoc(teacherRef);
          if (teacherSnap.exists()) {
            setTeacherName(teacherSnap.data().name || 'Teacher');
          }
        } catch (error) {
          console.error('Error fetching teacher name:', error);
        }
      }
    };

    fetchTeacherName();
  }, [data.teacher_id]);

  const handlePressIn = () => {
    Animated.timing(elevationAnim, {
      toValue: 8,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(elevationAnim, {
      toValue: 2,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleViewMore = async () => {
    setModalVisible(true);
    if (!seen) {
      try {
        const db = getFirestore();
        const assignmentRef = doc(db, 'assignments', data.id);
        await updateDoc(assignmentRef, { seen: true });
        setSeen(true);
      } catch (error) {
        console.error('Error updating seen status:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleClosePress = () => {
    if (onClose && data.id) {
      onClose(data.id);
    }
  };

  const assignmentName = data.assignmentName || data.name || 'Assignment';
  const className = data.className || 'Class';
  const assignmentType = data.assignmentType || data.type || 'Assignment';
  const studentName = data.studentName || 'Your child';
  const description = data.description || '';
  const dateAssigned = data.date_assigned
    ? new Date(data.date_assigned.seconds * 1000).toLocaleDateString()
    : 'Unknown';
  const dueDate = data.due_date
    ? new Date(data.due_date.seconds * 1000).toLocaleDateString()
    : 'Unknown';

  const primaryColor = '#141212';
  const secondaryColor = '#8FFFBD';

  return (
    <>
      <Animated.View style={[styles.card, { elevation: elevationAnim }]}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleViewMore}
          style={styles.touchable}
        >
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <Avatar.Icon
                size={30}
                icon="file-document"
                color="white"
                style={[styles.icon, { backgroundColor: "#FF6D5B" }]}
              />
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>{assignmentType}</Text>
              </View>
              {!seen && <View style={styles.greenDot} />}
            </View>
            <Text style={styles.title}>{`New ${assignmentType} Assigned To ${studentName}`}</Text>

            <View style={styles.actions}>
              <View style={styles.infoContainer}>
                <Text style={styles.classNameText}>{className}</Text>
                <Text style={styles.dateText}>{`Assigned on: ${dateAssigned}`}</Text>
              </View>
              <TouchableOpacity onPress={handleViewMore} style={styles.viewMoreButton}>
                <Text style={styles.viewMoreButtonText}>View More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Avatar.Icon
              size={50}
              icon="file-document"
              color="#FFFFFF"
              style={[styles.icon, { backgroundColor: "#FF6D5B", marginBottom: 20 }]}
            />
            <Text style={styles.modalTitle}>{assignmentName}</Text>
            {description ? <Text style={styles.modalDescription}>{description}</Text> : null}
            <Text style={styles.modalText}>Class: {className}</Text>
            <Text style={styles.modalText}>Assigned on: {dateAssigned}</Text>
            <Text style={styles.modalText}>Due Date: {dueDate}</Text>

            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    width: width * 0.93,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 8, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    backgroundColor: 'white',
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: "#F3B289",
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 16,
  },
  classNameText: {
    marginTop: 10,
    fontSize: 14,
    color: '#141212',
    marginBottom: 4,
    fontWeight: '400',
  },
  dateText: {
    fontSize: 15,
    color: '#888888',
  },
  tagContainer: {
    marginLeft: 10,
    backgroundColor: '#FF6D5B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFA771',
  },
  tagText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  greenDot: {
    width: 15,
    height: 15,
    borderRadius: 20,
    backgroundColor: '#00FF00',
    marginLeft: 'auto',
    marginRight: 10,
  },
  touchable: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    backgroundColor: '#FF6D5B',
    borderWidth: 2,
    borderColor: '#FFA771',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#141212',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewMoreButton: {
    backgroundColor: '#FF6D5B',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 8,
    borderWidth: 4,
    borderColor: '#FFA771',
  },
  viewMoreButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFA771'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#141212',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#FF6D5B',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#FFA771'
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default GradeCardComponent;