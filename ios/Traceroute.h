#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

static NSString *const kTracerouteUpdateEvent = @"tracerouteUpdateEvent";

@interface TracerouteModule : RCTEventEmitter <RCTBridgeModule>

@end
