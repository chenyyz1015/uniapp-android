import GenerateUserSigLibES from "./GenerateUserSigLibES.min";

/** TUICallKit AppID */
const SDKAppID = Number(import.meta.env.VITE_TUICALLKIT_APPID);

/** TUICallKit 密钥 */
const SDKSECRETKEY = import.meta.env.VITE_TUICALLKIT_SECRET_KEY;

/**
 * Expiration time for the signature, it is recommended not to set it too short.
 * Time unit: seconds
 * Default time: 7 x 24 x 60 x 60 = 604800 = 7 days
 */
const EXPIRETIME = Number(import.meta.env.VITE_TUICALLKIT_EXPIRE_TIME || 604800);

/**
 * 生成 TUICallKit 用户签名
 * @param {string} userId
 * @returns TUICallKit SDK Options
 */
export function genTUICallKitUserSig(userId) {
  const generator = new GenerateUserSigLibES(SDKAppID, SDKSECRETKEY, EXPIRETIME);
  const userSig = generator.genUserSig(userId);
  const userID = userId || `user_${Math.ceil(Math.random() * 10)}`;

  return { SDKAppID, userSig, userID };
}
