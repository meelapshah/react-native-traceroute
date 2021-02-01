#import "Traceroute.h"
#import <PhoneNetSDK/PhoneNetSDK.h>
#import <stdlib.h>

@implementation TracerouteModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(doTraceroute:(NSString*)address:(NSString*)probeType:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject)
{
    NSString *tracerouteId = [NSString stringWithFormat:@"traceroute%d",arc4random_uniform(99999)];
    NSLog(@"traceroute id: %s", tracerouteId);
    resolve(tracerouteId);
    if ([probeType isEqualToString:@"udp"]) {
      [PNUdpTraceroute start:address complete:^(NSMutableString *res) {
        [self sendEventWithName:tracerouteId
              body:@{
                @"stdout": res,
                @"stderr": @"",
                @"exitcode": @0
              }];
      }];
      return;
    }

    [[PhoneNetManager shareInstance] netStartTraceroute:address tracerouteResultHandler:^(NSString * _Nullable res, NSString * _Nullable destIp) {
      [self sendEventWithName:tracerouteId
        body:@{
          @"stdout": res,
          @"stderr": @"",
          @"exitcode": @0
      }];
    }];
    // reject(@"not_supported", @"traceroute on ios not currently implemented", nil);
}

@end
