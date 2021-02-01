#import "Traceroute.h"
#import <PhoneNetSDK/PhoneNetSDK.h>

@implementation TracerouteModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(doTraceroute:(NSString*)address:(NSString*)probeType:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject)
{
  if ([probeType isEqualToString:@"udp"]) {
    [PNUdpTraceroute start:address complete:^(NSMutableString *res) {
      resolve(@{
        @"output": res,
        @"done": @YES
      });
    }];
  } else {
    if ([[PhoneNetManager shareInstance] isDoingTraceroute]) {
      reject(@"EINPROGRESS", @"Traceroute in progress.", nil);
      return;
    }
    NSMutableString *result = [NSMutableString stringWithCapacity:10000];
    // [[PhoneNetManager shareInstance] settingSDKLogLevel:PhoneNetSDKLogLevel_DEBUG];
    [[PhoneNetManager shareInstance]
        netStartTraceroute:address
        tracerouteResultHandler:^(NSString * _Nullable res, NSString * _Nullable destIp) {
          [result appendString:res];
          [result appendString:@"\n"];
          [self sendEventWithName:kTracerouteUpdateEvent
                body:@{
                    @"output": result,
                    @"done": @NO
                }];
        }
        tracerouteCompleteHandler:^{
          // NSLog(@"complete result:%@", result);
          [self sendEventWithName:kTracerouteUpdateEvent
                body:@{
                    @"output": result,
                    @"done": @YES
                }];
        }
    ];
    resolve(nil);
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    kTracerouteUpdateEvent
  ];
}

@end
