#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(YandexPay, NSObject)

RCT_EXTERN_METHOD(initialize:(NSDictionary *)config
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

@interface RCT_EXTERN_REMAP_MODULE(YandexPayCheckoutButton, YandexPayCheckoutButtonViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(theme, NSString)
RCT_EXPORT_VIEW_PROPERTY(paymentSheet, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(onCheckoutSuccess, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCheckoutAbort, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCheckoutError, RCTDirectEventBlock)

@end
