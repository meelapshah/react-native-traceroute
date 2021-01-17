import { NativeModules } from 'react-native';

type TracerouteType = {
  multiply(a: number, b: number): Promise<number>;
};

const { Traceroute } = NativeModules;

export default Traceroute as TracerouteType;
