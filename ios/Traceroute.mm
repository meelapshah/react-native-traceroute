#import "Traceroute.h"

@implementation Traceroute

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(doTraceroute:(NSArray*)cliArgs:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject)
{
    reject(@"not_supported", @"traceroute on ios not currently implemented", nil);
}

@end
