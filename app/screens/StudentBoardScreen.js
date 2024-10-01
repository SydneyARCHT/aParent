import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

function StudentBoardScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Grades')} 
        >
          <Card.Content>
            <Text style={styles.cardText}>Grades</Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Behavior')} 
        >
          <Card.Content>
            <Text style={styles.cardText}>Behavior</Text>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.row}>
        <Card
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Attendance')} 
        >
          <Card.Content>
            <Text style={styles.cardText}>Attendance</Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Assignments')}
        >
          <Card.Content>
            <Text style={styles.cardText}>Assignments</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '45%', 
    height: 150,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
});

export default StudentBoardScreen;