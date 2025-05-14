# Template APK Modification Guide for Satoshi Bean Mining

This guide explains how to modify an existing Android template APK to connect to your self-hosted Satoshi Bean Mining platform.

## Prerequisites

1. A template APK file with WebView functionality
2. Your Satoshi Bean Mining platform running on your server
3. Android development tools

## Required Tools

1. **APKTool** - For decompiling/recompiling the APK
2. **Android Studio** - For making advanced modifications and testing
3. **Java JDK** - Required for signing the APK
4. **Keytool/Jarsigner** - For signing the modified APK

## Step 1: Install Required Software

```bash
# Install Java JDK (if not already installed)
sudo apt install openjdk-11-jdk

# Install APKTool
mkdir -p ~/android-tools && cd ~/android-tools
wget https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_2.6.1.jar -O apktool.jar
wget https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/linux/apktool -O apktool
chmod +x apktool
sudo mv apktool apktool.jar /usr/local/bin/

# Download and install Android Studio from https://developer.android.com/studio
```

## Step 2: Decompile the Template APK

```bash
# Create a working directory
mkdir -p ~/apk-modification && cd ~/apk-modification

# Decompile the APK
apktool d path/to/template_app.apk -o template_app
```

## Step 3: Locate and Modify WebView Configuration

1. Look for the main activity file, typically in `template_app/smali/com/example/app/MainActivity.smali`
2. Search for WebView related code in the smali files:

```bash
grep -r "WebView" template_app/smali
```

3. For a more readable view, look for Java source files if available:

```bash
find template_app -name "*.java"
```

4. If you can't find Java source files, identify the MainActivity class in the decompiled smali code.

## Step 4: Modify the WebView URL

In most template apps, you'll need to make the following changes:

1. **Find the WebView initialization and loadUrl call**:

For Java files (if available), look for code like:
```java
WebView webView = findViewById(R.id.webView);
webView.loadUrl("https://original-url.com");
```

2. **Replace the URL with your Satoshi Bean Mining server**:
```java
webView.loadUrl("https://your-server-address:port");
```

3. **For Smali files**, locate the corresponding patterns:
```smali
const-string v1, "https://original-url.com"
invoke-virtual {v0, v1}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
```

Change to:
```smali
const-string v1, "https://your-server-address:port"
invoke-virtual {v0, v1}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
```

## Step 5: Enable JavaScript and WebSockets

Find the WebView settings configuration:

```java
// For Java
WebSettings webSettings = webView.getSettings();
webSettings.setJavaScriptEnabled(true);
webSettings.setDomStorageEnabled(true);
```

Make sure these settings are enabled. In Smali, look for:

```smali
invoke-virtual {v1}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;
move-result-object v1
const/4 v2, 0x1
invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V
```

## Step 6: Modify App Icons and Branding

1. Replace the app icon files in the `template_app/res/drawable` and `template_app/res/mipmap` folders with your Satoshi Bean Mining logos.
2. Update the app name in `template_app/res/values/strings.xml`:

```xml
<string name="app_name">Satoshi Bean Mining</string>
```

## Step 7: Update Android Permissions

Make sure the following permissions are in the `template_app/AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Step 8: Recompile the APK

```bash
# Recompile the modified code
apktool b template_app -o satoshi_bean_mining.apk
```

## Step 9: Sign the APK

```bash
# Generate a new key if you don't have one
keytool -genkey -v -keystore satoshi_bean_key.keystore -alias satoshibean -keyalg RSA -keysize 2048 -validity 10000

# Sign the APK with your key
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore satoshi_bean_key.keystore satoshi_bean_mining.apk satoshibean

# Verify the signature
jarsigner -verify -verbose satoshi_bean_mining.apk
```

## Step 10: Install and Test

1. Transfer the signed APK to your Android device
2. Install it by tapping on the file
3. Test the connection to your self-hosted Satoshi Bean Mining server

## Troubleshooting Common APK Modification Issues

### WebView Not Loading Content

1. Check internet permissions in AndroidManifest.xml
2. Verify your server URL is correct and accessible from the device
3. Add error handling to the WebView:

```java
webView.setWebViewClient(new WebViewClient() {
    @Override
    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
        Log.e("WebView Error", description);
    }
});
```

### SSL Certificate Issues

If your server uses HTTPS with a self-signed certificate:

```java
webView.setWebViewClient(new WebViewClient() {
    @Override
    public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
        // WARNING: this is insecure for production apps, only use for testing
        handler.proceed();
    }
});
```

### Back Button Navigation

Add proper back button handling:

```java
@Override
public void onBackPressed() {
    if (webView.canGoBack()) {
        webView.goBack();
    } else {
        super.onBackPressed();
    }
}
```

## Additional Features to Consider

### Offline Support

Add a cache manifest to your web app and configure the WebView to support offline access:

```java
webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
webSettings.setAppCacheEnabled(true);
```

### Push Notifications

Integrate Firebase Cloud Messaging (FCM) to enable push notifications:

1. Add Firebase to your APK
2. Set up a JavaScript bridge to communicate between WebView and native code
3. Handle FCM tokens in your web application

### File Access

Enable file access for downloading mining reports:

```java
webSettings.setAllowFileAccess(true);
webSettings.setAllowContentAccess(true);
```

## Conclusion

By following this guide, you can convert any template APK with a WebView into a dedicated app for your Satoshi Bean Mining platform. This approach provides users with a native app experience while leveraging your existing web-based platform.

Remember to test thoroughly on multiple devices before distributing the APK to users. For production use, consider publishing to the Google Play Store for wider distribution.