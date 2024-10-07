import * as React from 'react';
import { Avatar, Card, Text, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';


const CardComponent = ({ data, onClose, onView }) => {
  const handleClosePress = () => {
    if (onClose && data.id) {
      onClose(data.id); 
    }
  };

  return (
    <PaperProvider>
      <Card style={{ marginVertical: 8 }}>
        <Card.Title
          title={data?.name || data?.title || 'No Title'}
          subtitle={data?.content || data?.feedback || 'No Description'}
          left={(props) => <Avatar.Icon {...props} icon="information" />} 
        />
        <Card.Content>
          <Text variant="bodySmall" style={{ color: '#888' }}>{data?.date || 'No Date Available'}</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={onView}>View</Button>
          <Button onPress={handleClosePress}>Close</Button>
        </Card.Actions>
      </Card>
    </PaperProvider>
  );
};

export default CardComponent;

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#e91e63',
//   },
// };