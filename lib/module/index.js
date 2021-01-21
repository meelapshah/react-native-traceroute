import { NativeEventEmitter, NativeModules } from 'react-native';
const TracerouteEventEmitter = new NativeEventEmitter(NativeModules.TracerouteModule);
export function Traceroute(cliArgs, onUpdate) {
  let id;

  const onEvent = evt => {
    onUpdate(evt);

    if (evt.exitcode !== undefined && id) {
      TracerouteEventEmitter.removeListener(id, onEvent);
    }
  };

  NativeModules.Traceroute.doTraceroute(cliArgs).then(eventId => {
    id = eventId;
    TracerouteEventEmitter.addListener(id, onEvent);
  });
}
export default Traceroute;
//# sourceMappingURL=index.js.map