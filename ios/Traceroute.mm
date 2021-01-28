#import "Traceroute.h"

@implementation Traceroute

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(doTraceroute:(NSArray*)cliArgs:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject)
{
    NSString *s = @"traceroute";
    NSString *t = @"8.8.8.8";
    char *argv[2];
    argv[0] = (char *)calloc([s length]+1, 1);
    strncpy(argv[0], [s UTF8String], [s length]);
    argv[1] = (char *)calloc([t length]+1, 1);
    strncpy(argv[1], [t UTF8String], [t length]);
    runtraceroute(2, argv);
    free(argv[0]);
    free(argv[1]);
    reject(@"not_supported", @"traceroute on ios not currently implemented", nil);
}

@end
