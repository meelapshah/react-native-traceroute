#include <jni.h>
#include <android/log.h>

#define TAG "traceroute-jni"

#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__);
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__);

JNIEXPORT jint JNICALL
Java_com_reactnativetraceroute_TracerouteModule_nativeTraceroute(JNIEnv *env, jclass type, jobjectArray jarray) {
    LOGE("not implemented yet");
    return -1;
}
