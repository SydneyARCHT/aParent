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

const CardComponent = ({ data, onClose, onView }) => {
  const [elevationAnim] = React.useState(new Animated.Value(2));
  const [modalVisible, setModalVisible] = useState(false);
  const [teacherName, setTeacherName] = useState('Teacher');
  const [seen, setSeen] = useState(data.seen);

  useEffect(() => {
    const fetchTeacherName = async () => {
      if (data.teacher_id) {
        try {
          const db = getFirestore();
          const teacherPath = data.teacher_id.path; // Extract path from reference field
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
        setSeen(true); // Update local seen state after update
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

  // Extract data with fallbacks
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

  // Colors
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
            {/* Header */}
            <View style={styles.header}>
              <Avatar.Icon
                size={30}
                icon="file-document"
                color="white"
                style={[styles.icon, { backgroundColor: "#F0C9FF" }]}
              />
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>{assignmentType}</Text>
              </View>
              {/* Green Dot for Unseen */}
              {!seen && <View style={styles.greenDot} />}
            </View>
            <Text style={styles.title}>{`New ${assignmentType} Assigned To ${studentName}`}</Text>

            {/* Button */}
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleViewMore} style={styles.viewMoreButton}>
                <Text style={styles.viewMoreButtonText}>View More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal */}
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
              style={[styles.icon, { backgroundColor: "#F0C9FF", marginBottom: 20 }]}
            />
            <Text style={styles.modalTitle}>{assignmentName}</Text>
            {description ? <Text style={styles.modalDescription}>{description}</Text> : null}
            <Text style={styles.modalText}>Assigned by: {teacherName}</Text>
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

const BORDER_WIDTH = 10;

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    width: width * 0.93,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    backgroundColor: 'white', 
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 1.3,
    borderColor: "#F0C9FF",
  },
  tagContainer: {
    marginLeft: 10,
    backgroundColor: '#F0C9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  greenDot: {
    width: 16,
    height: 16,
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
    backgroundColor: '#141212',
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
    backgroundColor: '#F0C9FF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 8,
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
    backgroundColor: '#C88FFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CardComponent;
