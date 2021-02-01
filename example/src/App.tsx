import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import Traceroute, {TracerouteResult} from 'react-native-traceroute';


export default function App() {
  const [stdout, setStdout] = React.useState<string>("");
  const [stderr, setStderr] = React.useState<string>("");
  const [exitcode, setExitcode] = React.useState<number | undefined>();


  React.useEffect(() => {
    Traceroute(
    '8.8.8.8',
    'icmp',
    (evt: TracerouteResult) => {
    setStdout(evt.stdout);
    setStderr(evt.stderr);
    setExitcode(evt.exitcode);
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text>Stdout</Text>
      <Text>{stdout}</Text>
      <Text>Stderr</Text>
      <Text>{stderr}</Text>
      <Text>Exitcode: {exitcode}</Text>
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
