import { createSSRApp } from "vue";
import App from "./App.vue";

// #ifdef APP-PLUS
const TUICallKit = uni.requireNativePlugin("TencentCloud-TUICallKit");
const TUICallKitEvent = uni.requireNativePlugin("globalEvent");
const TUICallEngine = uni.requireNativePlugin(
  "TencentCloud-TUICallKit-TUICallEngine",
);
uni.$TUICallKit = TUICallKit;
uni.$TUICallKitEvent = TUICallKitEvent;
uni.$TUICallEngine = TUICallEngine;
console.log("[TUICallKit]：", TUICallKit);
console.log("[TUICallKitEvent]：", TUICallKitEvent);
console.log("[TUICallEngine]：", TUICallEngine);
// #endif

export function createApp() {
  const app = createSSRApp(App);

  return { app };
}
