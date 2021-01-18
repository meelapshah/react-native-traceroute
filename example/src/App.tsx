import * as React from 'react';

import { NativeEventEmitter, NativeModules, StyleSheet, View, Text } from 'react-native';
import Traceroute from 'react-native-traceroute';


export default function App() {
  const [tracerouteId, setTracerouteId] = React.useState<number | undefined>();
  const [stdout, setStdout] = React.useState<string>("");
  const [stderr, setStderr] = React.useState<string>("");
  const [exitcode, setExitcode] = React.useState<number | undefined>();


  React.useEffect(() => {
    const f = async () => {
      const id = await Traceroute.doTraceroute([
        'traceroute',
        '-4',
        /* '--udp',
         * '--port=50000', */
        '8.8.8.8',
      ]);
      setTracerouteId(id);
      const ee = new NativeEventEmitter(NativeModules.TracerouteModule);
      ee.addListener(id, (evt) => {
        setStdout(evt.stdout);
        setStderr(evt.stderr);
        setExitcode(evt.exitcode);
      });
    }
    f();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Id: {tracerouteId}</Text>
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
