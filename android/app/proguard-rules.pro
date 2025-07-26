# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.

# For more details, see:
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ------------------------------------------------------------------
# 👇 Required for react-native-sqlite-storage to prevent class removal
-keep class io.liteglue.** { *; }
-keep class org.pgsqlite.** { *; }

# ------------------------------------------------------------------
# 👇 Recommended: Prevent stripping of React Native core classes
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

# 👇 Keep native modules
-keep class com.facebook.react.bridge.ReactPackage { *; }
-keep class com.facebook.react.bridge.JavaScriptModule { *; }
-keep class com.facebook.react.uimanager.ViewManager { *; }

# 👇 Optional: Prevent obfuscation of your model/data classes
# Uncomment and adjust if needed
# -keep class com.yourapp.models.** { *; }

# 👇 Optional: Keep annotations used by some RN libraries
-keepattributes *Annotation*

# 👇 Optional: Keep logging
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}
