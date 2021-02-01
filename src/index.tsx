import { NativeEventEmitter, NativeModules } from 'react-native';

export interface TracerouteResult {
  output: string;
  done: boolean;
}

const TracerouteUpdateEvent = "tracerouteUpdateEvent";

const TracerouteModule = NativeModules.TracerouteModule;

const TracerouteEventEmitter = TracerouteModule
  ? new NativeEventEmitter(TracerouteModule)
  : undefined;

let tracerouteInProgress: boolean = false;

export async function Traceroute(
  address: string,
  probeType: "udp" | "icmp",
  onUpdate: (result: TracerouteResult) => void
): Promise<void> {
  if (!TracerouteModule) {
    throw new Error("No traceroute module.");
  }
  if (tracerouteInProgress) {
    console.error("rejecting, in progress");
    throw new Error("Traceroute in progress.");
  }
  tracerouteInProgress = true;
  const listener = (evt: TracerouteResult) => {
    onUpdate(evt);
    if (evt.done) {
      tracerouteInProgress = false;
      TracerouteEventEmitter.removeListener(TracerouteUpdateEvent, listener);
    }
  };
  TracerouteEventEmitter.addListener(TracerouteUpdateEvent, listener);
  await TracerouteModule.doTraceroute(address, probeType)
}

export default Traceroute;
