"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Traceroute = Traceroute;
exports.default = void 0;

var _reactNative = require("react-native");

const TracerouteUpdateEvent = "tracerouteUpdateEvent";
const TracerouteModule = _reactNative.NativeModules.TracerouteModule;
const TracerouteEventEmitter = TracerouteModule ? new _reactNative.NativeEventEmitter(TracerouteModule) : undefined;
let tracerouteInProgress = false;

async function Traceroute(address, probeType, onUpdate) {
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

var _default = Traceroute;
exports.default = _default;
//# sourceMappingURL=index.js.map