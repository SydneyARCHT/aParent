import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#e91e63',
  },
};

const CardComponent = ({ data }) => {
  return (
    <PaperProvider theme={theme}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> 
        <Card.Content style={styles.content}>
          <Text variant="titleLarge">{data?.name || data?.title || 'No Title'}</Text>
          <Text variant="bodyMedium">{data?.content || data?.feedback || 'No Description'}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => alert('Read More clicked!')}>Read More</Button>
        </Card.Actions>
      </Card>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 15,
  },
  content: {
    paddingVertical: 16,
  },
});

export default CardComponent;