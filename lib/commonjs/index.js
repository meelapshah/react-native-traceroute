"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Traceroute = Traceroute;
exports.default = void 0;

var _reactNative = require("react-native");

const TracerouteEventEmitter = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.TracerouteModule);

function Traceroute(cliArgs, onUpdate) {
  let id;

  const onEvent = evt => {
    onUpdate(evt);

    if (evt.exitcode !== undefined && id) {
      TracerouteEventEmitter.removeListener(id, onEvent);
    }
  };

  _reactNative.NativeModules.Traceroute.doTraceroute(cliArgs).then(eventId => {
    id = eventId;
    TracerouteEventEmitter.addListener(id, onEvent);
  });
}

var _default = Traceroute;
exports.default = _default;
//# sourceMappingURL=index.js.map