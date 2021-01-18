import { NativeEventEmitter, NativeModules } from 'react-native';

export interface TracerouteResult {
  stdout: string;
  stderr: string;
  exitcode?: number;
}

const TracerouteEventEmitter = new NativeEventEmitter(NativeModules.Traceroute);

export function Traceroute(
  cliArgs: string[],
  onUpdate: (result: TracerouteResult) => void
) {
  NativeModules.Traceroute.doTraceroute(cliArgs).then((id: string) => {
    TracerouteEventEmitter.addListener(id, (evt: TracerouteResult) => {
      onUpdate(evt);
      if (evt.exitcode !== undefined) {
        TracerouteEventEmitter.removeListener(id);
      }
    });
  });
}

export default Traceroute;
