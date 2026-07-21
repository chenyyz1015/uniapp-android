# ============================================================
# simpleapp ProGuard 混淆规则
# uni-app (DCloud) Android 本地离线打包工程
# ============================================================
#
# 项目信息:
#   包名: com.example.simpleapp
#   入口: io.dcloud.PandoraEntry / io.dcloud.PandoraEntryActivity
#   SDK版本: HBuilder 5.15 / uni-app Android SDK 5.15
#   minifyEnabled: true (release)
#   shrinkResources: true
#   multiDexEnabled: true
#
# 默认混淆文件: proguard-android-optimize.txt
# ============================================================

# ============================================================
# 基础保留规则
# ============================================================

# 保留行号信息，方便调试堆栈
-keepattributes SourceFile,LineNumberTable
# 混淆时隐藏原始源文件名
-renamesourcefileattribute SourceFile

# 保留注解
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keepattributes Exceptions

# 保留泛型信息
-keepattributes RuntimeVisibleAnnotations
-keepattributes RuntimeInvisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations
-keepattributes RuntimeInvisibleParameterAnnotations

# 保留所有实现 Serializable 接口的类
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# 保留 Parcelable 实现类
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# 保留枚举类
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# 保留 R 文件及其内部类
-keep class **.R$* { *; }
-keepclassmembers class **.R$* {
    public static <fields>;
}

# 保留 native 方法 (uni-app V8 引擎 JNI 调用)
-keepclasseswithmembernames class * {
    native <methods>;
}

# 保留自定义 View 的构造函数
-keepclassmembers class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

# 保留 WebView JavaScript 接口 (uni-app 核心桥接)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ============================================================
# DCloud / uni-app SDK 核心 (io.dcloud.*)
# DCloud SDK 大量使用反射加载 feature 插件，必须全部保留
# ============================================================

# 保留所有 DCloud SDK 核心类
-keep class io.dcloud.** { *; }
-keepclassmembers class io.dcloud.** { *; }
-dontwarn io.dcloud.**

# 保留 DCloud Application 和 Activity
-keep class io.dcloud.PandoraEntry { *; }
-keep class io.dcloud.PandoraEntryActivity { *; }
-keep class io.dcloud.application.** { *; }

# 保留 DCloud 非 io.dcloud 包名下的类 (com.dcloud.*)
# 注意: com.dcloud ≠ io.dcloud，当前 io.dcloud.** 规则不匹配此包
-keep class com.dcloud.** { *; }
-keepclassmembers class com.dcloud.** { *; }
-dontwarn com.dcloud.**

# 保留 DCloud adapter (io.src.dcloud.* 也不匹配 io.dcloud.**)
-keep class io.src.dcloud.** { *; }
-dontwarn io.src.dcloud.**

# 保留 DCloud 重打包的 OkHttp/OkIO (dc.squareup.*)
-keep class dc.squareup.okhttp3.** { *; }
-keep interface dc.squareup.okhttp3.** { *; }
-dontwarn dc.squareup.okhttp3.**
-keep class dc.squareup.okio.** { *; }
-dontwarn dc.squareup.okio.**

# 保留 DCloud 重打包的 OkHttp Cookie (dc.squareup.cookie.*)
-keep class dc.squareup.cookie.** { *; }
-dontwarn dc.squareup.cookie.**

# 保留 Weex 框架 (uniapp-v8-release.aar)
# Weex 是 uni-app V8 引擎的核心渲染框架，大量 JNI + 反射调用
-keep class com.taobao.weex.** { *; }
-keepclassmembers class com.taobao.weex.** { *; }
-dontwarn com.taobao.weex.**

# 保留 Weex JNI 绑定的 native 方法
-keepclasseswithmembernames class com.taobao.weex.** {
    native <methods>;
}

# 保留 Weex 反射调用的桥接方法
-keepclassmembers class com.taobao.weex.bridge.** {
    public <methods>;
    public <init>(...);
}

# 保留 BindingX 手势库 (uniapp-v8-release.aar 内嵌 JAR)
-keep class com.alibaba.android.bindingx.** { *; }
-dontwarn com.alibaba.android.bindingx.**

# 保留 DCloud ImageLoader (lib.5plus.base-release.aar 内嵌 JAR)
-keep class com.nostra13.dcloudimageloader.** { *; }
-dontwarn com.nostra13.dcloudimageloader.**

# 保留 NineOldAndroids (lib.5plus.base-release.aar 内嵌 JAR)
-keep class io.dcloud.nineoldandroids.** { *; }
-dontwarn io.dcloud.nineoldandroids.**

# 保留 Android Transcoder 视频转码
-keep class androidtranscoder.** { *; }
-dontwarn androidtranscoder.**

# 保留 DCloud MediaPicker 媒体选择
-keep class com.dmcbig.mediapicker.** { *; }
-dontwarn com.dmcbig.mediapicker.**

# 保留字符编码检测
-keep class org.mozilla.universalchardet.** { *; }
-dontwarn org.mozilla.universalchardet.**

# 保留 Breakpad 崩溃上报 JNI
-keep class com.sample.breakpad.** { *; }
-keepclasseswithmembernames class com.sample.breakpad.** {
    native <methods>;
}
-dontwarn com.sample.breakpad.**

# ============================================================
# 确保所有 AAR 内嵌类库的 JNI 方法不被混淆
# ============================================================

# 保留所有 jni/ 目录下 .so 文件对应的 JNI native 方法
-keepclasseswithmembernames class * {
    native <methods>;
}

# 保留 DCloud Feature 实现类 (dcloud_properties.xml 中通过全类名字符串反射加载)
-keep class io.dcloud.feature.barcode2.** { *; }
-keep class io.dcloud.js.map.amap.** { *; }
-keep class io.dcloud.js.map.** { *; }
-keep class io.dcloud.feature.contacts.** { *; }
-keep class io.dcloud.adapter.messaging.** { *; }
-keep class io.dcloud.js.camera.** { *; }
-keep class io.dcloud.feature.pdr.** { *; }
-keep class io.dcloud.feature.device.** { *; }
-keep class io.dcloud.js.file.** { *; }
-keep class io.dcloud.feature.sensor.** { *; }
-keep class io.dcloud.invocation.** { *; }
-keep class io.dcloud.feature.ui.** { *; }
-keep class io.dcloud.js.gallery.** { *; }
-keep class io.dcloud.net.** { *; }
-keep class io.dcloud.feature.audio.** { *; }
-keep class io.dcloud.media.** { *; }
-keep class io.dcloud.feature.statistics.** { *; }
-keep class io.dcloud.feature.nativeObj.** { *; }
-keep class io.dcloud.js.geolocation.** { *; }
-keep class io.dcloud.appstream.js.** { *; }
-keep class io.dcloud.feature.aps.** { *; }

# 保留 DCloud WebView 相关
-keep class io.dcloud.common.** { *; }
-keep class io.dcloud.base.** { *; }

# ============================================================
# uni-app V8 引擎 (uniapp-v8-release.aar)
# ============================================================

# 保留 V8 引擎相关类 (JNI 反射调用)
-keep class io.dcloud.v8.** { *; }
-keep class com.dcloud.v8.** { *; }
-keep class org.chromium.** { *; }
-dontwarn io.dcloud.v8.**
-dontwarn com.dcloud.v8.**

# ============================================================
# HTML5+ 基础库 (lib.5plus.base-release.aar)
# ============================================================

-keep class io.dcloud.html5.** { *; }
-keep class io.dcloud.fiveplus.** { *; }
-dontwarn io.dcloud.html5.**
-dontwarn io.dcloud.fiveplus.**

# ============================================================
# Debug Server (debug-server-release.aar)
# 仅 debug 模式下使用，release 时不需要
# ============================================================

-dontwarn io.dcloud.debug.**
-keep class io.dcloud.debug.** { *; }

# ============================================================
# Breakpad 崩溃上报 (breakpad-build-release.aar)
# ============================================================

-keep class io.dcloud.breakpad.** { *; }
-dontwarn io.dcloud.breakpad.**

# ============================================================
# OAID 设备标识 SDK (oaid_sdk_1.0.25.aar)
# ============================================================

-keep class com.bun.miitmdid.** { *; }
-keep class com.bun.lib.** { *; }
-keep class com.samsung.android.deviceidservice.** { *; }
-dontwarn com.bun.miitmdid.**
-dontwarn com.bun.lib.**

# 支持各厂商 OAID 实现
-keep class com.asus.msa.** { *; }
-keep class com.coolpad.deviceidsupport.** { *; }
-keep class com.huawei.hms.ads.** { *; }
-keep class com.meizu.flyme.openidsdk.** { *; }
-keep class com.netease.nis.sdkwrapper.** { *; }
-keep class com.oppo.instant.local.** { *; }
-keep class com.vivo.identifier.** { *; }
-keep class com.xiaomi.mipush.sdk.** { *; }
-keep class com.zui.deviceidservice.** { *; }
-keep class com.zui.opendeviceidlibrary.** { *; }
-dontwarn com.asus.msa.**
-dontwarn com.coolpad.deviceidsupport.**
-dontwarn com.huawei.hms.ads.**
-dontwarn com.meizu.flyme.openidsdk.**
-dontwarn com.netease.nis.sdkwrapper.**
-dontwarn com.oppo.instant.local.**
-dontwarn com.vivo.identifier.**
-dontwarn com.xiaomi.mipush.sdk.**
-dontwarn com.zui.deviceidservice.**
-dontwarn com.zui.opendeviceidlibrary.**

# ============================================================
# Android GIF Drawable (android-gif-drawable-1.2.29.aar)
# ============================================================

-keep class pl.droidsonroids.gif.** { *; }
-dontwarn pl.droidsonroids.gif.**

# ============================================================
# 自定义插件 (dcloud_properties.xml 中注册)
# ============================================================

-keep class com.example.H5PlusPlugin.** { *; }
-dontwarn com.example.H5PlusPlugin.**

# ============================================================
# FastJSON (反射序列化)
# ============================================================

-keep class com.alibaba.fastjson.** { *; }
-keepclassmembers class * {
    @com.alibaba.fastjson.annotation.JSONField <fields>;
    @com.alibaba.fastjson.annotation.JSONField <methods>;
}
-dontwarn com.alibaba.fastjson.**

# ============================================================
# OkHttp 3.x
# ============================================================

-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okio.** { *; }

# ============================================================
# Fresco 图片库
# ============================================================

-keep class com.facebook.fresco.** { *; }
-keep class com.facebook.imagepipeline.** { *; }
-keep class com.facebook.drawee.** { *; }
-keep class com.facebook.fbui.textlayoutbuilder.** { *; }
-keep class com.facebook.soloader.** { *; }
-keepclassmembers class * {
    @com.facebook.common.internal.DoNotStrip <fields>;
    @com.facebook.common.internal.DoNotStrip <methods>;
}
-dontwarn com.facebook.fresco.**
-dontwarn com.facebook.imagepipeline.**
-dontwarn com.facebook.drawee.**
-dontwarn com.facebook.soloader.**

# ============================================================
# Glide 图片加载库
# ============================================================

-keep class com.bumptech.glide.** { *; }
-keep class com.bumptech.glide.integration.** { *; }
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep class * extends com.bumptech.glide.module.AppGlideModule
-keep class com.bumptech.glide.GeneratedAppGlideModuleImpl
-keep public class * extends com.bumptech.glide.module.LibraryGlideModule
-keepclassmembers class * extends com.bumptech.glide.module.AppGlideModule {
    <init>(...);
}
-keep class com.bumptech.glide.load.data.DataFetcher
-dontwarn com.bumptech.glide.**

# ============================================================
# Zip4j 压缩库
# ============================================================

-keep class net.lingala.zip4j.** { *; }
-dontwarn net.lingala.zip4j.**

# ============================================================
# AndroidX / Support 库
# ============================================================

# AndroidX AppCompat
-keep class androidx.appcompat.** { *; }
-keep interface androidx.appcompat.** { *; }
-dontwarn androidx.appcompat.**

# AndroidX Core
-keep class androidx.core.** { *; }
-dontwarn androidx.core.**

# AndroidX Fragment
-keep class androidx.fragment.** { *; }
-dontwarn androidx.fragment.**

# AndroidX RecyclerView
-keep class androidx.recyclerview.** { *; }
-dontwarn androidx.recyclerview.**

# AndroidX WebKit
-keep class androidx.webkit.** { *; }
-dontwarn androidx.webkit.**

# AndroidX LocalBroadcastManager
-keep class androidx.localbroadcastmanager.** { *; }
-dontwarn androidx.localbroadcastmanager.**

# ============================================================
# MultiDex
# ============================================================

-keep class androidx.multidex.** { *; }
-dontwarn androidx.multidex.**

# ============================================================
# 高德地图 (dcloud_properties.xml 中引用 amap)
# ============================================================

-keep class com.amap.api.** { *; }
-keep class com.autonavi.** { *; }
-keep class com.loc.** { *; }
-dontwarn com.amap.api.**
-dontwarn com.autonavi.**
-dontwarn com.loc.**

# ============================================================
# 其他通用规则
# ============================================================

# 保留 JavaScript 回调接口
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 保留 WebView 相关
-keep class android.webkit.** { *; }
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, int);
    public void *(android.webkit.WebChromeClient, android.webkit.WebView);
}

# 保留资源 ID (反射调用)
-keepclassmembers class **.R$* {
    public static <fields>;
}

# 保留 Kotlin 相关 (如果 SDK 中使用了 Kotlin)
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}
-dontwarn kotlin.**

# 保留 Android 四大组件
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider

# 保留 Application 子类
-keep public class * extends android.app.Application {
    public <init>();
}

# 移除未使用的日志 (可选，减小包体积)
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
}

# 优化规则
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# 不警告未找到的引用 (AAR 内部依赖可能存在可选引用)
-dontwarn javax.annotation.**
-dontwarn javax.lang.model.**
-dontwarn javax.naming.**
-dontwarn javax.servlet.**
-dontwarn org.codehaus.mojo.animal_sniffer.**
-dontwarn org.conscrypt.**
-dontwarn org.openjsse.**
-dontwarn sun.misc.**
