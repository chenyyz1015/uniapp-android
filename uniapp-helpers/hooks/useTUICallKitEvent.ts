import { useToast } from "wot-design-uni";
import { CallMediaType } from "./useTUICallKit";

export const useTUICallKitEvent = () => {
  const toast = useToast();

  const tuicallkit = useTUICallKit();
  const userStore = useUserStore();

  /** 错误回调 */
  const onError = (res: any) => {
    console.log("[TUICallKitEvent]：onError", res);
  };

  /** 通话请求回调 */
  const onCallReceived = (res: any) => {
    console.log("[TUICallKitEvent]：onCallReceived", res);
  };

  /** 通话取消回调 */
  const onCallCancelled = (res: any) => {
    console.log("[TUICallKitEvent]：onCallCancelled", res);
  };

  /** 通话接通回调 */
  const onCallBegin = (res: any) => {
    console.log("[TUICallKitEvent]：onCallBegin", res);
    if (res.callMediaType === CallMediaType.VIDEO) {
      try {
        console.log("[TUICallKitEvent]：onCallBegin 通话已建立，当前正在视频通话");
        console.log("[TUICallKitEvent]：onCallBegin 开始设置视频编码参数");
        tuicallkit.setVideoResolutionParams();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("[TUICallKitEvent]：onCallBegin 通话已建立，当前正在语音通话");
    }
  };

  /** 通话结束回调 */
  const onCallEnd = (res: any) => {
    console.log("[TUICallKitEvent]：onCallEnd", res);
  };

  /** 通话类型改变回调 */
  const onCallMediaTypeChanged = (res: any) => {
    console.log("[TUICallKitEvent]：onCallMediaTypeChanged", res);
  };

  /** 用户拒绝通话回调 */
  const onUserReject = (res: any) => {
    console.log("[TUICallKitEvent]：onUserReject", res);
  };

  /** 用户不响应回调 */
  const onUserNoResponse = (res: any) => {
    console.log("[TUICallKitEvent]：onUserNoResponse", res);
  };

  /** 用户忙线回调 */
  const onUserLineBusy = (res: any) => {
    console.log("[TUICallKitEvent]：onUserLineBusy", res);
  };

  /** 用户加入通话回调 */
  const onUserJoin = (res: any) => {
    console.log("[TUICallKitEvent]：onUserJoin", res);
  };

  /**  用户离开通话回调 */
  const onUserLeave = (res: any) => {
    console.log("[TUICallKitEvent]：onUserLeave", res);
  };

  /** 用户是否有视频流回调 */
  const onUserVideoAvailable = (res: any) => {
    console.log("[TUICallKitEvent]：onUserVideoAvailable", res);
  };

  /** 用户是否有音频流回调 */
  const onUserAudioAvailable = (res: any) => {
    console.log("[TUICallKitEvent]：onUserAudioAvailable", res);
  };

  /** 所有用户音量大小反馈回调 */
  const onUserVoiceVolumeChanged = (res: any) => {
    console.log("[TUICallKitEvent]：onUserVoiceVolumeChanged", res);
  };

  /** 所有用户网络质量反馈回调 */
  const onUserNetworkQualityChanged = (res: any) => {
    console.log("[TUICallKitEvent]：onUserNetworkQualityChanged", res);
  };

  /** 当前用户被踢下线 */
  const onKickedOffline = (res: any) => {
    console.log("[TUICallKitEvent]：onKickedOffline", res);
    try {
      const userID = userStore.userInfo.userId.toString();
      tuicallkit.login(userID);
    } catch (error) {
      console.error("[TUICallKitEvent]：onKickedOffline", error);
    }
  };

  /** 在线时票据过期 */
  const onUserSigExpired = (res: any) => {
    console.log("[TUICallKitEvent]：onUserSigExpired", res);
    try {
      const userID = userStore.userInfo.userId.toString();
      tuicallkit.login(userID);
    } catch (error) {
      console.error("[TUICallKitEvent]：onUserSigExpired", error);
    }
  };

  /** 点击（新增）自定义按钮反馈回调 */
  const onCustomViewClickEvent = (res: any) => {
    console.log("[TUICallKitEvent]：CustomViewClickEvent", res);
  };

  /** 注册 TUICallKit 监听事件 */
  const addAllEventListeners = () => {
    uni.$TUICallKitEvent.addEventListener("onError", onError);
    uni.$TUICallKitEvent.addEventListener("onCallReceived", onCallReceived);
    uni.$TUICallKitEvent.addEventListener("onCallCancelled", onCallCancelled);
    uni.$TUICallKitEvent.addEventListener("onCallBegin", onCallBegin);
    uni.$TUICallKitEvent.addEventListener("onCallEnd", onCallEnd);
    uni.$TUICallKitEvent.addEventListener("onCallMediaTypeChanged", onCallMediaTypeChanged);
    uni.$TUICallKitEvent.addEventListener("onUserReject", onUserReject);
    uni.$TUICallKitEvent.addEventListener("onUserNoResponse", onUserNoResponse);
    uni.$TUICallKitEvent.addEventListener("onUserLineBusy", onUserLineBusy);
    uni.$TUICallKitEvent.addEventListener("onUserJoin", onUserJoin);
    uni.$TUICallKitEvent.addEventListener("onUserLeave", onUserLeave);
    uni.$TUICallKitEvent.addEventListener("onUserVideoAvailable", onUserVideoAvailable);
    uni.$TUICallKitEvent.addEventListener("onUserAudioAvailable", onUserAudioAvailable);
    uni.$TUICallKitEvent.addEventListener("onUserVoiceVolumeChanged", onUserVoiceVolumeChanged);
    uni.$TUICallKitEvent.addEventListener("onUserNetworkQualityChanged", onUserNetworkQualityChanged);
    uni.$TUICallKitEvent.addEventListener("onKickedOffline", onKickedOffline);
    uni.$TUICallKitEvent.addEventListener("onUserSigExpired", onUserSigExpired);
    uni.$TUICallKitEvent.addEventListener("CustomViewClickEvent", onCustomViewClickEvent);
  };

  /** 移除 TUICallKit 监听事件 */
  const removeAllEventListeners = () => {
    uni.$TUICallKitEvent.removeAllEventListeners();
  };

  onLoad(() => {
    // #ifdef APP-PLUS
    addAllEventListeners();
    // #endif
  });

  onUnload(() => {
    // #ifdef APP-PLUS
    removeAllEventListeners();
    // #endif
  });

  return {};
};
