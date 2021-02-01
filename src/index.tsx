import { NativeEventEmitter, NativeModules } from 'react-native';

export interface TracerouteResult {
  stdout: string;
  stderr: string;
  exitcode?: number;
}

const TracerouteEventEmitter = new NativeEventEmitter(NativeModules.TracerouteModule);

export function Traceroute(
  address: string,
  probeType: "udp" | "icmp",
  onUpdate: (result: TracerouteResult) => void
) {
  NativeModules.TracerouteModule.doTraceroute(address, probeType).then((id: string) => {
    const listener = (evt: TracerouteResult) => {
      onUpdate(evt);
      if (evt.exitcode !== undefined) {
        TracerouteEventEmitter.removeListener(id, listener);
      }
    };
    TracerouteEventEmitter.addListener(id, listener);
  });
}

export default Traceroute;
