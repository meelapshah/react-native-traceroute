import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import Traceroute from 'react-native-traceroute';


export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    Traceroute.doTraceroute([
      'traceroute',
      '-4',
      '--udp',
      '--port=50000',
      '8.8.8.8',
    ]).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
