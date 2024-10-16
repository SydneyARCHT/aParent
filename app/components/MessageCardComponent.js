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

const MessageCardComponent = ({ data, onClose, onSeenUpdate }) => {
  const [elevationAnim] = React.useState(new Animated.Value(2));
  const [modalVisible, setModalVisible] = useState(false);
  const [senderName, setSenderName] = useState('Sender');
  const [seen, setSeen] = useState(data.seen);

  useEffect(() => {
    const fetchSenderName = async () => {
      if (data.sender_id && data.sender_type) {
        try {
          const db = getFirestore();
          const senderPath = data.sender_id.path;
          let senderRef;

          if (data.sender_type === 'teacher') {
            senderRef = doc(db, senderPath);
          } else if (data.sender_type === 'parent') {
            senderRef = doc(db, senderPath);
          } else if (data.sender_type === 'student') {
            senderRef = doc(db, senderPath);
          }

          if (senderRef) {
            const senderSnap = await getDoc(senderRef);
            if (senderSnap.exists()) {
              setSenderName(senderSnap.data().name || 'Sender');
            }
          }
        } catch (error) {
          console.error('Error fetching sender name:', error);
        }
      }
    };

    fetchSenderName();
  }, [data.sender_id, data.sender_type]);

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
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (!seen) {
      try {
        const db = getFirestore();
        const messageRef = doc(db, `chats/${data.chatId}/messages`, data.id);
        updateDoc(messageRef, { seen: true });
        setSeen(true);
        if (onSeenUpdate) {
          onSeenUpdate(data.id);
        }
      } catch (error) {
        console.error('Error updating seen status:', error);
      }
    }
  };

  const handleClosePress = () => {
    if (onClose && data.id) {
      onClose(data.id);
    }
  };

  const content = data.content || 'No content available';
  const timestamp = data.timestamp && data.timestamp.seconds
    ? new Date(data.timestamp.seconds * 1000).toLocaleString()
    : 'No timestamp available';
  const avatarUri = data.avatarUri || 'https://via.placeholder.com/50';

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
                icon="message-text"
                color="white"
                style={[styles.icon, { backgroundColor: "#5DEFFF" }]}
              />
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>Message</Text>
              </View>
              {!seen && <View style={styles.greenDot} />}
            </View>
            <Text style={styles.title}>{`New Message from ${senderName}`}</Text>

            <View style={styles.actions}>
              <Text style={styles.timestampText}>{timestamp}</Text>
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
              icon="message-text"
              color="#FFFFFF"
              style={[styles.icon, { backgroundColor: '#5DEFFF', marginBottom: 20 }]}
            />
            <View style={styles.messageContainer}>
              <View style={styles.avatar}>
                <Avatar.Text
                  size={40}
                  borderWidth={1}
                  borderColor={'black'}
                  label={senderName.charAt(0).toUpperCase()}
                  style={styles.avatar}
                />
              </View>

              <View style={styles.textBubble}>
                <Text style={styles.messageText}>{content}</Text>
              </View>
            </View>
            <Text style={styles.modalTimestamp}>Sent on: {timestamp}</Text>

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
    width: width * 0.92,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#A7F5FE',
  },
  avatar: {
    borderWidth: 2,
    borderColor:'black',
  },
  tagContainer: {
    marginLeft: 10,
    backgroundColor: '#5DEFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A7F5FE',
  },
  tagText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  greenDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#00FF00',
    position: 'absolute',
    top: 10,
    right: 10,
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
    backgroundColor: '#5DEFFF',
    borderWidth: 2,
    borderColor: '#A7F5FE',
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
    backgroundColor: '#5DEFFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 8,
    borderWidth: 4,
    borderColor: '#A7F5FE',
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
    borderColor: '#A7F5FE'
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#FFFFFF',
  },
  textBubble: {
    backgroundColor: '#F1F0F0',
    borderRadius: 16,
    padding: 12,
    marginLeft: 12,
    maxWidth: width * 0.6,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#111827',
  },
  modalTimestamp: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#5DEFFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#A7F5FE',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  timestampText: {
    fontSize: 14,
    color: '#888888',
    marginRight: 12,
    alignSelf: 'center',
  },
});

export default MessageCardComponent;