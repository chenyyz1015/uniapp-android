import { StorageSerializers } from "@vueuse/core";
import { useToast } from "wot-design-uni";
import { genTUICallKitUserSig } from "@/plugins/TencentCloud-TUICallKit/GenerateUserSig";
import Dialing from "@/static/audios/TencentCloud-TUICallKit/phone_dialing.mp3";
import Ringing from "@/static/audios/TencentCloud-TUICallKit/phone_ringing.mp3";

export interface EnableOptions {
  /** 是否开启静音模式（开启后不会播放来电铃声） */
  muteMode?: boolean;
  /** 是否开启悬浮窗功能 */
  floatWindow?: boolean;
  /** 是否来电横幅显示 */
  incomingBanner?: boolean;
}

/** 来电铃声（枚举值） */
export enum CallingBell {
  ringing = "ringing",
  dialing = "dialing",
}

/** 来电铃声 */
export const CallingBellMap: Record<CallingBell, string> = {
  ringing: Ringing,
  dialing: Dialing,
};

/** 来电铃声（名称） */
export const CallingBellNameMap: Record<CallingBell, string> = {
  ringing: "Ringing",
  dialing: "Dialing",
};

export const useTUICallKit = createSharedComposable(() => {
  const toast = useToast();

  /** TUICallKit 是否可用 */
  const TUICallKitAccess = useStorageSync("TUICallKitAccess", false, { serializer: StorageSerializers.boolean });

  /**
   * 登录
   * @param {string} userID 用户 ID
   * @returns 是否登录成功
   */
  const login = (userID: string) => {
    return new Promise<boolean>((resolve, reject) => {
      const options = genTUICallKitUserSig(userID);
      console.log("[TUICallKit]：login", options);
      try {
        uni.$TUICallKit.login(options, (res: any) => {
          if (res.code === 0) {
            console.log("[TUICallKit]：login success");
            TUICallKitAccess.value = true;
            resolve(true);
          } else {
            console.error(`[TUICallKit]：login failed, error code = ${res.code}, error message = ${res.msg}`);
            TUICallKitAccess.value = false;
            resolve(false);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * 登出
   * @returns 是否登出成功
   */
  const logout = () => {
    return new Promise<boolean>((resolve, reject) => {
      if (!TUICallKitAccess.value) {
        console.error("[TUICallKit]：logout 用户未登录，当前登出功能不可用");
        return reject(new Error("用户未登录，当前登出功能不可用"));
      }
      try {
        uni.$TUICallKit.logout((res: any) => {
          if (res.code === 0) {
            console.log("[TUICallKit]：logout success");
            TUICallKitAccess.value = false;
            resolve(true);
          } else {
            console.error(`[TUICallKit]：logout failed, error code = ${res.code}, error message = ${res.msg}`);
            resolve(false);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * 设置用户基础信息
   * @param {string} nickName 用户昵称
   * @param {string} avatar 用户头像
   * @returns 是否设置成功
   */
  const setSelfInfo = (nickName?: string, avatar?: string) => {
    return new Promise<boolean>((resolve, reject) => {
      if (!TUICallKitAccess.value) {
        console.error("[TUICallKit]：setSelfInfo 用户未登录，当前设置信息功能不可用");
        return reject(new Error("用户未登录，当前设置信息功能不可用"));
      }
      const options = { nickName, avatar };
      console.log("[TUICallKit]：setSelfInfo", options);
      try {
        uni.$TUICallKit.setSelfInfo(options, (res: any) => {
          if (res.code === 0) {
            console.log("[TUICallKit]：setSelfInfo success");
            resolve(true);
          } else {
            console.log(`[TUICallKit]：setSelfInfo failed, error code = ${res.code}, error message = ${res.msg}`);
            resolve(false);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * 拨打电话（1v1通话）
   * @param {string[]} userIDList 被呼叫的用户列表
   * @param {number} callMediaType 通话方式：1-语音通话 | 2-视频通话
   * @returns 是否拨打成功
   */
  const callTo = (userIDList: string[], callMediaType: 1 | 2 = 1) => {
    return new Promise<boolean>((resolve, reject) => {
      if (!TUICallKitAccess.value) {
        toast.show("当前通话功能不可用");
        console.error("[TUICallKit]：callTo 用户未登录，当前通话功能不可用");
        return reject(new Error("用户未登录，当前通话功能不可用"));
      }
      const options = {
        userIDList,
        callMediaType, // 语音通话(callMediaType = 1)、视频通话(callMediaType = 2)
      };
      console.log("[TUICallKit]：callTo", options);
      try {
        uni.$TUICallKit.calls(options, (res: any) => {
          if (res.code === 0) {
            console.log("[TUICallKit]：call success");
            resolve(true);
          } else {
            console.error(`[TUICallKit]：call failed, error code = ${res.code}, error message = ${res.msg}`);
            resolve(false);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * 主动加入通话
   * @param {string} callId 此次通话的唯一 ID
   * @returns 是否加入成功
   */
  const joinTo = (callId: string) => {
    return new Promise<boolean>((resolve, reject) => {
      if (!TUICallKitAccess.value) {
        toast.show("当前加入通话功能不可用");
        console.error("[TUICallKit]：joinTo 用户未登录，当前加入通话功能不可用");
        return reject(new Error("用户未登录，当前加入通话功能不可用"));
      }
      const options = { callId };
      console.log("[TUICallKit]：joinTo", options);
      try {
        uni.$TUICallKit.join(options, (res: any) => {
          if (res.code === 0) {
            console.log("[TUICallKit]：joinInGroupCall success");
            resolve(true);
          } else {
            console.error(`[TUICallKit]：joinInGroupCall failed, error code = ${res.code}, error message = ${res.msg}`);
            resolve(false);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * 设置自定义来电铃声
   * @param {CallingBell} bell
   * @returns 是否设置成功
   */
  const setCallingBell = (bell: CallingBell) => {
    return new Promise<boolean>((resolve, reject) => {
      if (!TUICallKitAccess.value) {
        toast.show("当前设置铃声功能不可用");
        console.error("[TUICallKit]：setCallingBell 用户未登录，当前设置铃声功能不可用");
        return reject(new Error("用户未登录，当前设置铃声功能不可用"));
      }
      // 本地存放的音频文件
      const tempFilePath = CallingBellMap[bell];
      let musicFilePath = "";
      uni.saveFile({
        tempFilePath,
        success: (saveResult) => {
          console.log("[TUICallKit]：setCallingBell 保存来电铃声成功", saveResult);
          musicFilePath = saveResult.savedFilePath;
          // 相对路径转绝对路径，否则访问不到
          musicFilePath = plus.io.convertLocalFileSystemURL(musicFilePath);
          console.log("[TUICallKit]：setCallingBell musicFilePath", musicFilePath);
          // 设置铃声
          try {
            uni.$TUICallKit.setCallingBell(musicFilePath, (res: any) => {
              if (res.code === 0) {
                console.log("[TUICallKit]：setCallingBell success");
                resolve(true);
              } else {
                console.error(
                  `[TUICallKit]：setCallingBell failed, error code = ${res.code}, error message = ${res.msg}`
                );
                resolve(false);
              }
            });
          } catch (error) {
            reject(error);
          }
        },
        fail: (error) => {
          console.error("[TUICallKit]：setCallingBell 保存来电铃声失败", error);
          return reject(new Error("保存来电铃声失败"));
        },
      });
    });
  };

  /**
   * 开启/关闭功能选项
   * @param {EnableOptions} options 选项
   * @param {boolean} [options.muteMode] 是否开启静音模式
   * @param {boolean} [options.floatWindow] 是否开启悬浮窗功能
   * @param {boolean} [options.incomingBanner] 是否来电横幅显示
   * @returns 是否设置成功
   */
  const enable = (options: EnableOptions = {}) => {
    return new Promise<boolean>((resolve, reject) => {
      if (!TUICallKitAccess.value) {
        console.error("[TUICallKit]：enable 用户未登录，当前功能不可用");
        return reject(new Error("用户未登录，当前功能不可用"));
      }
      console.log("[TUICallKit]：enable", options);
      try {
        const { muteMode = false, floatWindow = false, incomingBanner = false } = options ?? {};
        uni.$TUICallKit.enableMuteMode(muteMode);
        uni.$TUICallKit.enableFloatWindow(floatWindow);
        uni.$TUICallKit.enableIncomingBanner(incomingBanner);
        console.log("[TUICallKit]：enable success");
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  return { TUICallKitAccess, login, logout, setSelfInfo, callTo, joinTo, setCallingBell, enable };
});
