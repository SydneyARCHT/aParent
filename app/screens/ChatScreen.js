import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { auth, database } from '../config/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

function ChatScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  // Fetch all chats where the parent_id matches the reference of the current user's parent document
  const fetchChats = async () => {
    try {
      // Create a reference to the parent document using the logged-in user's ID
      const parentRef = doc(database, 'parents', user.uid);
      const chatsRef = collection(database, 'chats');
      
      // Query for chats where the parent_id matches the logged-in user's reference
      const q = query(chatsRef, where('parent_id', '==', parentRef));
      const snapshot = await getDocs(q);

      const chatDataArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const chatData = doc.data();
          let teacherName = 'Unknown Teacher';

          // Fetch teacher name if available
          if (chatData.teacher_id) {
            try {
              const teacherDoc = await getDoc(chatData.teacher_id);
              if (teacherDoc.exists()) {
                teacherName = teacherDoc.data().name || 'Unknown Teacher';
              }
            } catch (error) {
              console.error('Error fetching teacher data:', error);
            }
          }

          return {
            id: doc.id,
            teacherName,
            ...chatData,
          };
        })
      );

      setChats(chatDataArray);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        {chats.length > 0 ? (
          chats.map((chat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('ChatDetails', { chatId: chat.id, teacherName: chat.teacherName })}
            >
              <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {`Chat with ${chat.teacherName ? chat.teacherName : 'Unknown Teacher'}`}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View>
            <Text>No chats available</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ChatScreen;
