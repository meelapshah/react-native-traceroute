export interface TracerouteResult {
    output: string;
    done: boolean;
}
export declare function Traceroute(address: string, probeType: "udp" | "icmp", onUpdate: (result: TracerouteResult) => void): Promise<void>;
export default Traceroute;
