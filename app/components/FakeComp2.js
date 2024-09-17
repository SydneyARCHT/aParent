import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#e91e63', 
  },
};

const FakeComp2 = () => (
  <PaperProvider theme={theme}>
    <Card style={styles.card}>
      <Card.Cover source={{ uri: 'https://picsum.photos/id/534/700' }} />
      <Card.Content style={styles.content}>
        <Text variant="titleLarge">No Class this Friday!</Text>
        <Text variant="bodyMedium">The school will be closed to prepare the teachers and staff  for an upcoming workshop on proper student practices. </Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained">Read More</Button>
      </Card.Actions>
    </Card>
  </PaperProvider>
);

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  content: {
    paddingVertical: 16,
  },
});

export default FakeComp2;