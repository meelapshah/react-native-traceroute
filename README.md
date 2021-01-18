# react-native-traceroute

traceroute

## Installation

```sh
npm install react-native-traceroute
```

## Usage

```js
import Traceroute from "react-native-traceroute";

// ...

Traceroute(["traceroute", "-4", "8.8.8.8"], (evt: TracerouteResult) => {
  // This callback is invoked whenever traceroute prints something.
  // So it will be called many times with updated values.
  // When exitcode is not undefined, we are done.
  console.log(evt.stdout);
  console.log(evt.stderr);
  console.log(evt.exitcode);
}
```

These were helpful:
https://github.com/wangjing53406/traceroute-for-android

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
