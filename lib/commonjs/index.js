"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Traceroute = Traceroute;
exports.default = void 0;

var _reactNative = require("react-native");

const TracerouteEventEmitter = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.Traceroute);

function Traceroute(address, probeType, onUpdate) {
  _reactNative.NativeModules.Traceroute.doTraceroute(address, probeType).then(id => {
    const listener = evt => {
      onUpdate(evt);

      if (evt.exitcode !== undefined) {
        TracerouteEventEmitter.removeListener(id, listener);
      }
    };

    TracerouteEventEmitter.addListener(id, listener);
  });
}

var _default = Traceroute;
exports.default = _default;
//# sourceMappingURL=index.js.map