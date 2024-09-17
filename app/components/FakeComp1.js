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

const FakeComp1 = () => (
  <PaperProvider theme={theme}>
    <Card style={styles.card}>
      <Card.Cover source={{ uri: 'https://picsum.photos/id/210/700' }} />
      <Card.Content style={styles.content}>
        <Text variant="titleLarge">Mandated State Testing</Text>
        <Text variant="bodyMedium">Mandatory state testing will be taken next week on Monday, Tuesday, and Wednesday. Please provide your child with a nutritionist breakfast!</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained">Read More</Button>
      </Card.Actions>
    </Card>
  </PaperProvider>
);

const styles = StyleSheet.create({
  card: {
    margin: 15,
  },
  content: {
    paddingVertical: 16,
  },
});

export default FakeComp1;