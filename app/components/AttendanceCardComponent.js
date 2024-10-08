import React, { useState } from 'react';
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
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const AttendanceCardComponent = ({ data, onSeenUpdate }) => {
  const [elevationAnim] = React.useState(new Animated.Value(2));
  const [modalVisible, setModalVisible] = useState(false);
  const [seen, setSeen] = useState(data.seen);

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
    if (onSeenUpdate && !seen) {
      try {
        const db = getFirestore();
        const attendanceRef = doc(db, 'attendance', data.id);
        await updateDoc(attendanceRef, { seen: true });
        await onSeenUpdate(data.id);
        setSeen(true); // Update local seen state after update
      } catch (error) {
        console.error('Error updating seen status:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Extract data with fallbacks
  const status = data.status ? data.status.toLowerCase() : 'absent';
  const date = data.timestamp
    ? new Date(data.timestamp.seconds * 1000).toLocaleDateString()
    : 'No date available';
  const studentName = data.studentName || 'Student';
  const className = data.className || 'Class';

  // Colors
  const primaryColor = '#F0C9FF'; // Light pink color for text and icons
  const secondaryColor = '#8FFFBD'; // Minty green for accents

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
                icon="clipboard-list"
                color="#FFFFFF"
                style={[styles.icon, { backgroundColor: primaryColor }]}
              />
              <View style={[styles.tagContainer, { borderColor: primaryColor }]}>
                <Text style={styles.tagText}>Attendance</Text>
              </View>
              {/* Green Dot for Unseen */}
              {!seen && <View style={styles.greenDot} />}
            </View>
            <Text style={styles.title}>{`New attendance report for ${date}`}</Text>

            {/* Button */}
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleViewMore} style={[styles.viewMoreButton, { backgroundColor: primaryColor }]}>
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
              icon="clipboard-list"
              color="#FFFFFF"
              style={[styles.icon, { backgroundColor: primaryColor, marginBottom: 20 }]}
            />
            <Text style={styles.modalTitle}>{`Attendance report for ${studentName}`}</Text>
            <Text style={styles.modalStatus}>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</Text>
            <Text style={styles.modalClass}>Class: {className}</Text>
            <Text style={styles.modalDate}>Date: {date}</Text>

            <TouchableOpacity onPress={handleCloseModal} style={[styles.closeButton, { backgroundColor: primaryColor }]}>
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
    width: width * 0.92,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#F0C9FF',
  },
  tagContainer: {
    marginLeft: 10,
    backgroundColor: '#F0C9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
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
    backgroundColor: '#F0C9FF',
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
    marginBottom: 20,
  },
  modalStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: '#141212',
    marginBottom: 8,
  },
  modalClass: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AttendanceCardComponent;
