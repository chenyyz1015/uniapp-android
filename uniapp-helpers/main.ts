import { createSSRApp } from "vue";
import App from "./App.vue";

// #ifdef APP-PLUS
const TUICallKit = uni.requireNativePlugin("TencentCloud-TUICallKit");
const TUICallKitEvent = uni.requireNativePlugin("globalEvent");
uni.$TUICallKit = TUICallKit;
uni.$TUICallKitEvent = TUICallKitEvent;
console.log("[TUICallKit]：", TUICallKit);
console.log("[TUICallKitEvent]：", TUICallKitEvent);
// #endif

export function createApp() {
  const app = createSSRApp(App);

  return { app };
}
