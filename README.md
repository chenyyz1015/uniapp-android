# uniapp-android

> 基于 uni-app 框架的 Android 本地离线打包工程。

- Hbuilder 版本：5.15
- Hbuilder Android SDK 版本：5.15

## 环境准备

### 1. 安装 Android Studio

下载并安装 [Android Studio](https://developer.android.com/studio)。

首次启动后，按照提示安装 Android SDK。

### 2. 安装 JDK 8+

Android 编译需要 JDK 8 及以上版本，并且生成本地签名证书时也会用到。

```bash
# 检查 JDK 版本
java -version
```

如果未安装，请前往 [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) 下载安装。

### 3. 安装 HBuilderX

下载并安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)，用于 uni-app 项目的开发和资源发布。

### 4. 下载 uni-app 离线 SDK

前往 [DCloud 原生开发者支持 - Android 离线 SDK](https://nativesupport.dcloud.net.cn/AppDocs/download/android)，下载与 HBuilderX **版本一致**的 Android 离线 SDK。

### 5. 申请 AppKey（离线打包密钥）

1. 登录 [DCloud 开发者中心](https://dev.dcloud.net.cn/)
2. 进入对应的 uni-app 应用 → **离线打包** 页面
3. 填写 **包名**（需与 `simpleapp/build.gradle` 中的 `applicationId` 一致）
4. 填写 **Android 应用签名 SHA1**、**SHA256**、**MD5**（从本地签名证书中获取，见下方签名配置章节）
5. 点击生成 **离线打包 Key**
6. 记录生成的 Key，该值用于 `AndroidManifest.xml` 中的 `dcloud_appkey`

> 注意：AppKey 与 uni-app 项目的 **AppID**、**包名** 和 **应用签名** 一一绑定。如果包名、AppID 或签名证书发生变更，需在 DCloud 开发者中心重新生成 Key。

---

## 核心配置说明

### 1. `dcloud_control.xml` — 关联 uni-app 应用

位置：`simpleapp/src/main/assets/data/dcloud_control.xml`

```xml
<Hbuilder debug="true" syncDebug="true" version="5.15">
    <apps>
        <app appid="__UNI__1B79CDB" appver="1.0.0"/>
    </apps>
</Hbuilder>
```

| 属性        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| `appid`     | uni-app 项目的 AppID，**必须完全一致**                       |
| `appver`    | uni-app 项目 manifest.json 中的版本号，留空时忽略版本校验    |
| `debug`     | 是否开启 WebView 调试，`true` 开启                           |
| `syncDebug` | 是否为同步调试模式（基座与 HBuilderX 联调），`true` 开启     |
| `version`   | uni-app SDK 版本号，需与使用的 Hbuilder Android SDK 版本一致 |

> **关键**：`appid` 必须与 uni-app 项目的 AppID 完全一致。

### 2. `AndroidManifest.xml` — AppKey 配置

位置：`simpleapp/src/main/AndroidManifest.xml`

```xml
<meta-data
    android:name="dcloud_appkey"
    android:value="8d7b233e40ba12960ea842a81860b0b7" />
```

| 属性            | 说明                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `dcloud_appkey` | 离线打包密钥，来自 [DCloud 开发者中心](https://dev.dcloud.net.cn/) → 对应应用 → 离线打包 → 生成的 Key |

> **关键**：此值不是 uni-app 的 AppID，而是 DCloud 开发者中心为该应用生成的**离线打包专用 Key**。每次更换应用或重置 Key 后需要同步更新。

### 3. 应用基础信息配置

#### `simpleapp/build.gradle`

```groovy
namespace 'com.example.simpleapp'            // 与包名保持一致

defaultConfig {
    applicationId "com.example.simpleapp"    // 包名，必须与 DCloud 开发者中心申请离线 Key 时填写的包名一致
    minSdkVersion 21                  // 最低支持 Android 5.0
    targetSdkVersion 33               // 目标版本 Android 13
    versionCode 1                     // 版本号（整数）
    versionName "1.0"                 // 版本名称
}
```

#### `buildTypes` — 构建类型与混淆配置

位置：`simpleapp/build.gradle`

```groovy
buildTypes {
    debug {
        signingConfig signingConfigs.config
        minifyEnabled false
        shrinkResources false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
    release {
        signingConfig signingConfigs.config
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

| 属性              | 说明                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `signingConfig`   | 签名配置引用，指向 `signingConfigs.config`（见下方签名配置章节）                              |
| `minifyEnabled`   | 是否启用代码混淆（ProGuard）。`debug` 为 `false`（不混淆），`release` 为 `true`（开启混淆）   |
| `shrinkResources` | 是否移除未使用的资源文件。`true` 开启资源压缩，可减小 APK 体积                                |
| `proguardFiles`   | 混淆规则文件路径。第一个为 Android 默认优化规则，第二个 `proguard-rules.pro` 为项目自定义规则 |

**debug vs release 差异说明**：

| 属性              | debug          | release          |
| ----------------- | -------------- | ---------------- |
| `minifyEnabled`   | `false`        | `true`           |
| `shrinkResources` | `false`        | `true`           |
| 构建产物          | 未混淆、体积大 | 混淆压缩、体积小 |
| 调试信息          | 保留           | 移除日志输出     |
| 适用场景          | 开发联调       | 正式发布         |

> - shrinkResources 依赖 minifyEnabled，两者必须同时开启
> - **debug** 关闭混淆以保留完整类名和方法名，方便在 HBuilderX 中联调时查看调用栈和日志。
> - **release** 开启混淆以保护代码、减小 APK 体积。混淆规则详见 `simpleapp/proguard-rules.pro`，已覆盖 DCloud SDK、OAID、FastJSON、OkHttp、Fresco、Glide、WebView JS 接口等所有依赖。
> - `getDefaultProguardFile('proguard-android-optimize.txt')` 引用 Android SDK 内置的优化混淆规则（位于 `<android-sdk>/tools/proguard/`）。
> - 如果需要在 release 包中保留完整的崩溃堆栈信息，可在 `proguard-rules.pro` 中启用 `-keepattributes SourceFile,LineNumberTable`（默认已启用）。

#### 应用标题

修改 `simpleapp/src/main/res/values/strings.xml`

```xml
<string name="app_name">SimpleApp</string>
```

#### 应用图标

替换以下各密度目录中的图标文件（注意保持文件名不变）：

```
simpleapp/src/main/res/
├── mipmap-mdpi/ic_launcher.png
├── mipmap-hdpi/ic_launcher.png
├── mipmap-xhdpi/ic_launcher.png
├── mipmap-xxhdpi/ic_launcher.png
└── mipmap-xxxhdpi/ic_launcher.png
```

#### 启动图（Splash Screen）

替换以下各密度目录中的启动图（保持文件名 `splash.png`）：

```
simpleapp/src/main/res/
├── drawable-mdpi/splash.png
├── drawable-hdpi/splash.png
├── drawable-xhdpi/splash.png
├── drawable-xxhdpi/splash.png
└── drawable-xxxhdpi/splash.png
```

#### 签名配置

##### 生成签名证书

如果没有现成的签名证书（`.jks` 或 `.keystore`），可以使用 JDK 自带的 `keytool` 生成：

```bash
keytool -genkey -alias your-alias -keyalg RSA -keysize 2048 -validity 36500 -keystore your-keystore.jks
```

| 参数              | 说明                                             |
| ----------------- | ------------------------------------------------ |
| `-keystore`       | 证书文件输出路径（建议放在 `simpleapp/` 目录下） |
| `-alias`          | 密钥别名，与 `build.gradle` 中 `keyAlias` 对应   |
| `-keyalg RSA`     | 密钥算法，固定为 RSA                             |
| `-keysize 2048`   | 密钥长度，推荐 2048 或更高                       |
| `-validity 36500` | 证书有效期（天），36500 天 ≈ 100 年              |

> 执行命令后会提示输入密钥密码、密钥库密码、组织、地点等信息，按提示填写即可。生成的 `.jks` 或 `.keystore` 文件请妥善保管，丢失后无法重新签名同一应用。

##### 获取证书签名指纹

DCloud 开发者中心申请离线 Key 时需要填写 **SHA1**、**SHA256**、**MD5** 签名指纹，可通过以下命令获取：

```bash
keytool -list -v -keystore simpleapp.jks
```

输出示例：

```
SHA1:  A1:B2:C3:D4:E5:F6:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:01
SHA256:  A1B2C3D4E5F67890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890
MD5:   A1:B2:C3:D4:E5:F6:78:90:AB:CD:EF:12:34:56:78
```

> 将上述命令中的证书路径、别名和密码替换为实际值后执行，将输出的签名指纹填入 DCloud 开发者中心对应位置。

##### build.gradle 签名配置

将生成的证书文件（如 `simpleapp.jks`）放入 `simpleapp/` 目录，然后在 `simpleapp/build.gradle` 中配置：

```groovy
// 从根目录的 local.properties 读取签名配置
def localProperties = new Properties()
def localFile = rootProject.file('local.properties')
if (localFile.exists()) {
    localProperties.load(new FileInputStream(localFile))
} else {
    println "警告: local.properties 文件不存在，请创建并配置签名信息"
}

signingConfigs {
    config {
        keyAlias localProperties.getProperty('SIGN_KEY_ALIAS')
        keyPassword localProperties.getProperty('SIGN_KEY_PASSWORD')
        storeFile file(localProperties.getProperty('SIGN_STORE_FILE_PATH', 'simpleapp.jks'))
        storePassword localProperties.getProperty('SIGN_STORE_PASSWORD')
        v1SigningEnabled true
        v2SigningEnabled true
    }
}
```

> 正式发布时，请将密钥密码迁移到 `local.properties`，避免敏感信息提交到版本控制。

---

## 打包构建

### 步骤 1：编译 uni-app 资源包

1. 使用 HBuilderX 打开 uni-app 项目
2. 确认 `manifest.json` 中 **AppID** 与 `dcloud_control.xml` 中的 `appid` 一致
3. 菜单栏 → **发行** → **原生App-本地打包**等待编译完成，在项目 `unpackage/resources` 目录下生成资源包（含 `www/` 文件夹）

### 步骤 2：导入资源包

将生成的 `www/` 文件夹完整复制到：

```
simpleapp/src/main/assets/apps/__UNI__1B79CDB/www/
```

> `__UNI__1B79CDB` 即 uni-app 项目的 AppID 目录名，不同项目不同。

### 步骤 3：用 Android Studio 构建

1. 用 Android Studio 打开本工程根目录 `simpleapp-android/`
2. 等待 Gradle 同步完成
3. 选择构建变体：
   - **debug** — 调试版本（使用 debug 签名）
   - **release** — 发布版本（使用配置的 jks 签名）
4. 菜单栏 → **Build** → **Build APK(s)**（或 **Build Bundle(s)** 出 AAB）

构建产物路径：

```
simpleapp/debug/simpleapp-debug.apk
simpleapp/release/simpleapp-release.apk
```

### 步骤 4：安装到设备

```bash
# 调试版本
adb install simpleapp/debug/simpleapp-debug.apk

# 发布版本
adb install simpleapp/release/simpleapp-release.apk
```

或者在 Android Studio 中点击 **Run** 按钮直接运行到设备。

---

## 自定义基座 debug 模式

自定义基座开启 debug 模式后，可以在 HBuilderX 中通过 Android Studio 模拟器调试 uni-app 页面，查看控制台日志等。

### 开启方式

在 `dcloud_control.xml` 中设置 `debug` 和 `syncDebug` 属性为 `true`：

```xml
<Hbuilder debug="true" syncDebug="true" version="5.15">
    <apps>
        <app appid="__UNI__1B79CDB" appver="1.0.0"/>
    </apps>
</Hbuilder>
```

| 属性        | 说明                                                    |
| ----------- | ------------------------------------------------------- |
| `debug`     | `true` — 开启 WebView 调试模式                          |
| `syncDebug` | `true` — 开启同步调试，HBuilderX 可与模拟器进行代码联调 |

### 引入 debug-server-release.aar

自定义基座的 debug 功能依赖 `debug-server-release.aar`，需在 `simpleapp/build.gradle` 中添加引用：

```groovy
dependencies {
    implementation "com.alibaba:fastjson:1.2.83"
    implementation "com.squareup.okhttp3:okhttp:3.12.12"
    implementation("net.lingala.zip4j:zip4j:2.11.5")
}
```

然后将 `debug-server-release.aar` 放入 `simpleapp/libs/` 目录：

```
simpleapp/libs/debug-server-release.aar
```

> **注意**：`debug-server-release.aar` 在官方 uni-app Android 离线 SDK 中**确实包含**，但它不在 `libs/` 文件夹里，而是存放在 SDK 的其他目录中（如 `SDK/libs/` 或其他子目录），通常需要手动找到并复制到 `simpleapp/libs/` 下。

### 调试步骤

1. 用 Android Studio 打开本工程，生成自定义基座 APK，打开 HBuilderX，在对应 uni-app 项目 unpackage 目录下创建 debug 目录，将上述生成的 APK 文件拷贝到 debug 目录中，并重命名文件为 android_debug.apk
2. 打开 HBuilderX，打开对应 uni-app 项目
3. 菜单栏 → **运行** → **运行到手机或模拟器** → **运行到 Android App 基座**
4. 在弹出的窗口中选择正在运行基座的模拟器，等待连接成功
5. 连接成功后，HBuilderX 控制台可查看日志输出，修改 uni-app 代码可实时同步到模拟器

### 注意事项

- **仅限开发阶段使用**：debug 模式会额外输出日志信息，影响性能，正式发布前务必关闭（将 `debug` 和 `syncDebug` 设置为 `false` 或移除）
- **安全风险**：开启 debug 模式可能暴露应用内部信息，发布版本中必须关闭

---

## 配置文件速查

| 文件                  | 位置                                              | 用途                            |
| --------------------- | ------------------------------------------------- | ------------------------------- |
| `dcloud_control.xml`  | `simpleapp/src/main/assets/data/`                 | 关联 uni-app 项目 AppID         |
| `AndroidManifest.xml` | `simpleapp/src/main/`                             | `dcloud_appkey`、权限、Activity |
| `build.gradle`        | `simpleapp/`                                      | 包名、版本、签名、依赖          |
| `strings.xml`         | `simpleapp/src/main/res/values/`                  | 应用显示名称                    |
| `mipmap-*`            | `simpleapp/src/main/res/mipmap-*/ic_launcher.png` | 应用图标                        |
| `drawable-*`          | `simpleapp/src/main/res/drawable-*/splash.png`    | 启动图                          |

## 常见问题

- **运行时提示"应用不存在"**：检查 `dcloud_control.xml` 中 `appid` 是否与 uni-app 项目 AppID 一致
- **应用无法联网/白屏**：检查 `dcloud_appkey` 是否正确（需从 DCloud 开发者中心获取离线 Key）
- **资源包未更新**：确认 `www/` 目录已完全覆盖，清理构建缓存后重试
- **签名不匹配**：覆盖安装时确保使用相同签名文件，否则需先卸载旧版本
