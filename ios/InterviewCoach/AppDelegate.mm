#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"InterviewCoach";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  // Metro bundler'ın adresini doğrudan belirtiyoruz
  // Bu, bağlantı sorunlarını çözmek için yardımcı olur
  NSString *localIP = @"localhost"; // Ayrıca makinenizin gerçek IP adresini de kullanabilirsiniz
  NSString *url = [NSString stringWithFormat:@"http://%@:8081/index.bundle?platform=ios", localIP];
  return [NSURL URLWithString:url];
  // return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end 