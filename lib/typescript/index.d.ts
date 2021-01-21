export interface TracerouteResult {
    stdout: string;
    stderr: string;
    exitcode?: number;
}
export declare function Traceroute(cliArgs: string[], onUpdate: (result: TracerouteResult) => void): void;
export default Traceroute;
