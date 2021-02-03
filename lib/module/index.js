import { NativeEventEmitter, NativeModules } from 'react-native';
const TracerouteUpdateEvent = "tracerouteUpdateEvent";
const TracerouteModule = NativeModules.TracerouteModule;
const TracerouteEventEmitter = TracerouteModule ? new NativeEventEmitter(TracerouteModule) : undefined;
let tracerouteInProgress = false;
export async function Traceroute(address, probeType, onUpdate) {
  if (!TracerouteModule) {
    throw new Error("No traceroute module.");
  }

  if (tracerouteInProgress) {
    console.error("rejecting, in progress");
    throw new Error("Traceroute in progress.");
  }

  tracerouteInProgress = true;

  const listener = evt => {
    onUpdate(evt);

    if (evt.done) {
      tracerouteInProgress = false;
      TracerouteEventEmitter.removeListener(TracerouteUpdateEvent, listener);
    }
  };

  TracerouteEventEmitter.addListener(TracerouteUpdateEvent, listener);
  await TracerouteModule.doTraceroute(address, probeType);
}
export default Traceroute;
//# sourceMappingURL=index.js.map