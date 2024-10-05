import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { auth, database } from '../config/firebaseConfig';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, doc } from 'firebase/firestore';

const ChatDetails = ({ route }) => {
  const { chatId, teacherName } = route.params; // Get the chatId and teacherName from navigation params
  const [messages, setMessages] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  // Fetch messages from Firestore
  const fetchMessages = async () => {
    try {
      const messagesRef = collection(database, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);

      const formattedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const senderId = data.sender_id.id; // Extract the ID from the reference

        return {
          _id: doc.id,
          text: data.content,
          createdAt: data.timestamp.toDate(),
          user: {
            _id: senderId, 
            name: data.sender_type === 'parent' ? 'Parent' : teacherName, 
          },
        };
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Handle sending a message
  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    // Add the message to Firestore
    try {
      const { _id, createdAt, text, user } = messages[0];
      const newMessage = {
        content: text,
        sender_id: doc(database, 'users', user._id), // Correctly reference the document in Firestore
        sender_type: 'parent', // Assuming the logged-in user is a parent
        timestamp: serverTimestamp(), // Use Firestore server timestamp
      };

      const messagesRef = collection(database, 'chats', chatId, 'messages');
      await addDoc(messagesRef, newMessage);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user?.uid, // Set the logged-in user's ID
          name: user?.displayName ?? 'User', // Use the display name of the user if available
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#0084ff', // Customize the right bubble color (user messages)
                },
                left: {
                  backgroundColor: 'white', // Customize the left bubble color (teacher messages)
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatDetails;
