// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// const NavBar = ({ navigation }) => {
//   return (
//     <View style={styles.navbar}>
//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')}>
//         <Text style={styles.buttonText}>Home</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')}>
//         <Text style={styles.buttonText}>Messages</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')}>
//         <Text style={styles.buttonText}>Student Board</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')}>
//         <Text style={styles.buttonText}>Parent Resources</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   navbar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: 60,
//     backgroundColor: '#333',
//     position: 'absolute',
//     bottom: 40,
//     width: '100%',
//   },
//   button: {
//     padding: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default NavBar;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NavBar = ({ navigation }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Parent')}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Messages')}>
        <Text style={styles.buttonText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StudentBoard')}>
        <Text style={styles.buttonText}>Student Board</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ParentResources')}>
        <Text style={styles.buttonText}>Parent Resources</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#333',
    position: 'absolute',
    bottom: 45, 
    width: '100%',

  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NavBar;