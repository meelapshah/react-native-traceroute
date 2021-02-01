export interface TracerouteResult {
    stdout: string;
    stderr: string;
    exitcode?: number;
}
export declare function Traceroute(address: string, probeType: "udp" | "icmp", onUpdate: (result: TracerouteResult) => void): void;
export default Traceroute;
