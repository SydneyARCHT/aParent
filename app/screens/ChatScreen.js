import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { auth, database } from '../config/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export default function ChatScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    // Fetch the parent ID based on the logged-in user
    const fetchParentId = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          console.log('Fetching parent ID for user:', user.email);
          const userQuery = query(collection(database, 'users'), where('email', '==', user.email));
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const userData = userDoc.data();
            console.log('User data:', userData);
            if (userData.userType === 'parent') {
              setParentId(userDoc.id);
              console.log('Parent ID set:', userDoc.id);
            } else {
              console.log('User is not a parent');
            }
          } else {
            console.log('No user found with the given email');
          }
        } catch (error) {
          console.error('Error fetching parent ID:', error);
        }
      } else {
        console.log('No user is currently logged in');
      }
    };

    fetchParentId();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!parentId) {
        console.log('Parent ID is not set yet');
        return;
      }

      try {
        // Construct the parent reference
        const parentRef = doc(database, 'parents', parentId);
        console.log('Fetching chats for parent reference:', parentRef.path);

        // Query the chats collection using the reference
        const chatsQuery = query(collection(database, 'chats'), where('parent_id', '==', parentRef));
        const chatsSnapshot = await getDocs(chatsQuery);

        if (!chatsSnapshot.empty) {
          const chatsData = await Promise.all(
            chatsSnapshot.docs.map(async (doc) => {
              const chatData = doc.data();

              // Debugging information to check the reference
              console.log('Chat Data:', chatData);

              // Resolve the teacher's name from teacher_id reference
              let teacherName = 'Unknown Teacher';
              if (chatData.teacher_id) {
                try {
                  const teacherDoc = await getDoc(chatData.teacher_id);
                  if (teacherDoc.exists()) {
                    teacherName = teacherDoc.data().name;
                    console.log('Resolved Teacher Name:', teacherName);
                  } else {
                    console.log('No teacher document found for reference:', chatData.teacher_id.path);
                  }
                } catch (error) {
                  console.error('Error fetching teacher data:', error);
                }
              } else {
                console.log('No teacher_id reference found in chat data');
              }

              return {
                id: doc.id,
                teacherName: teacherName,
                ...chatData,
              };
            })
          );

          setChats(chatsData);
          console.log('Chats data after processing:', chatsData);
        } else {
          console.log('No chats found for the given parent ID');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [parentId]);

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
                  {`Chat with ${chat.teacherName ?? 'Unknown Teacher'}`}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No chats available</Text> // Wrap the "No chats available" string inside a <Text> component
        )}
      </View>
    </SafeAreaView>
  );
}