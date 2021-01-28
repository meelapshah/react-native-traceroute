import { NativeEventEmitter, NativeModules } from 'react-native';
const TracerouteEventEmitter = new NativeEventEmitter(NativeModules.Traceroute);
export function Traceroute(cliArgs, onUpdate) {
  NativeModules.Traceroute.doTraceroute(cliArgs).then(id => {
    const listener = evt => {
      onUpdate(evt);

      if (evt.exitcode !== undefined) {
        TracerouteEventEmitter.removeListener(id, listener);
      }
    };

    TracerouteEventEmitter.addListener(id, listener);
  });
}
export default Traceroute;
//# sourceMappingURL=index.js.map