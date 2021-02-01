import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import Traceroute, {TracerouteResult} from 'react-native-traceroute';


export default function App() {
  const [output, setOutput] = React.useState<number | undefined>();


  React.useEffect(() => {
    console.log("starting traceroute");
    (async () => {
        try {
          await Traceroute("8.8.8.8", "icmp", (res: TracerouteResult) => {
            setOutput(res.output);
          });
        } catch (e) {
            console.error(`traceroute rejected: ${e}`);
        }
    })()
  }, []);
  return (
    <View style={styles.container}>
      <Text>Output</Text>
      <Text>{output}</Text>
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
