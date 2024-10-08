import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, StyleSheet } from 'react-native';
import { auth, database } from '../config/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import DrawerComponent from '../navigation/DrawerComponent';
import { createDrawerNavigator } from '@react-navigation/drawer';


const Drawer = createDrawerNavigator();

function ChatScreenContent({ navigation }) {
  const [chats, setChats] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);


  const fetchChats = async () => {
    try {

      const parentRef = doc(database, 'parents', user.uid);
      const chatsRef = collection(database, 'chats');

      const q = query(chatsRef, where('parent_id', '==', parentRef));
      const snapshot = await getDocs(q);

      const chatDataArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const chatData = doc.data();
          let userName = 'Unknown User';
          let recentMessage = '';

          // Fetch user name (teacher or parent)
          if (chatData.teacher_id) {
            try {
              const teacherDoc = await getDoc(chatData.teacher_id);
              if (teacherDoc.exists()) {
                userName = teacherDoc.data().name || 'Unknown User';
              }

              // Fetch the most recent message from the messages subcollection
              const messagesRef = collection(database, 'chats', doc.id, 'messages');
              const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
              const messagesSnapshot = await getDocs(messagesQuery);
              if (!messagesSnapshot.empty) {
                recentMessage = messagesSnapshot.docs[0].data().content || '';
              }
            } catch (error) {
              console.error('Error fetching user or message data:', error);
            }
          }

          return {
            id: doc.id,
            userName,
            recentMessage,
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
              onPress={() => navigation.navigate('ChatDetails', { chatId: chat.id, userName: chat.userName })}
            >
              <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center' }}>
                {chat.teacherAvatar ? (
                  <Image
                    source={{ uri: chat.teacherAvatar }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#ccc',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18 }}>
                      {chat.userName ? chat.userName.charAt(0).toUpperCase() : '?'}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 3 }}>
                    {chat.userName}
                  </Text>
                  <Text style={{ fontSize: 17, fontWeight: '300', color: 'gray' }}>
                    {chat.recentMessage}
                  </Text>
                </View>
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

const ChatScreen = () => {
  const parentAvatar = 'https://i.pravatar.cc/300';

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen
        name="Messages"
        component={ChatScreenContent}
        options={{
          headerStyle: {
            height: 180,
          },
          headerTitle: () => <CustomHeaderTitle />,
          headerRight: () => (
            <TouchableOpacity style={styles.avatarContainer} onPress={() => console.log('Avatar clicked')}>
              <Image source={{ uri: parentAvatar }} style={styles.avatar} />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLetter: {
    fontSize: 60,
    fontWeight: 'bold',
    marginTop: 60,
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

export default ChatScreen;