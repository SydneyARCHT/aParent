import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform, Image, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { auth, database } from '../config/firebaseConfig';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const ChatDetails = ({ route }) => {
  const { chatId, userName } = route.params; // Get the chatId and userName from navigation params
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

        // Strip quotation marks from the content
        const strippedContent = data.content.replace(/^"|"$/g, '');

        return {
          _id: doc.id,
          text: strippedContent,
          createdAt: data.timestamp.toDate(),
          user: {
            _id: senderId,
            name: data.sender_type === 'parent' ? 'Parent' : userName,
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

    try {
      const { text } = messages[0];

      // Get the parent reference if the current user is a parent
      let senderRef = null;
      let receiverRef = null;

      // Check if the logged-in user is a parent
      const userDoc = await getDoc(doc(database, 'users', user.uid));
      if (userDoc.exists()) {
        const userType = userDoc.data().userType;

        if (userType === 'parent') {
          // If the user is a parent, set sender to parent reference
          senderRef = doc(database, 'parents', user.uid);

          // Set receiver to the teacher reference from the chat
          const chatDoc = await getDoc(doc(database, 'chats', chatId));
          if (chatDoc.exists()) {
            receiverRef = chatDoc.data().teacher_id;
          }
        } else if (userType === 'teacher') {
          // If the user is a teacher, set sender to teacher reference
          senderRef = doc(database, 'teachers', user.uid);

          // Set receiver to the parent reference from the chat
          const chatDoc = await getDoc(doc(database, 'chats', chatId));
          if (chatDoc.exists()) {
            receiverRef = chatDoc.data().parent_id;
          }
        }
      }

      // Add the message to Firestore
      if (senderRef && receiverRef) {
        const newMessage = {
          content: text,
          sender_id: senderRef,
          receiver_id: receiverRef,
          sender_type: userDoc.data().userType, // Set to either 'parent' or 'teacher'
          timestamp: serverTimestamp(), // Use Firestore server timestamp
        };

        const messagesRef = collection(database, 'chats', chatId, 'messages');
        await addDoc(messagesRef, newMessage);
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }, [chatId]);

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
                  backgroundColor: 'white', // Customize the left bubble color (other messages)
                },
              }}
            />
          );
        }}
        forceGetKeyboardHeight={Platform.OS === 'android'}
        bottomOffset={Platform.OS === 'ios' ? 39 : 0} // Adjust bottom offset for iPhone with a notch
      />
    </View>
  );
};

export default ChatDetails;