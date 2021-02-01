# react-native-traceroute

traceroute

## Installation

```sh
npm install react-native-traceroute
```

For ios, add to Podfile
```
pod "PhoneNetSDK", :path => 'node_modules/react-native-traceroute/net-diagnosis'
```
## Usage

```js
import Traceroute from "react-native-traceroute";

// ...

try {
  await Traceroute("8.8.8.8", "icmp", (result: TracerouteResult) => {
    // use result.output and result.done
  });
} catch (e) {
  // ...
}
```

These were helpful:
https://github.com/wangjing53406/traceroute-for-android

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
