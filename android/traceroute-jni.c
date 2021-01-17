#include <jni.h>
#include <android/log.h>

#include "traceroute.h"

#define TAG "traceroute-jni"

#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__);
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__);

JNIEXPORT jint JNICALL
Java_com_reactnativetraceroute_TracerouteModule_nativeTraceroute(JNIEnv *env, jclass type, jobjectArray jarray) {
    jint argc = (*env)->GetArrayLength(env, jarray);
    LOGE("jarray has length %d", argc);

    jstring jargv[argc];
    char *argv[argc];
    for (int i = 0; i < argc; i++) {
        jargv[i] = (jstring) ((*env)->GetObjectArrayElement(env, jarray, i));
        argv[i] = (char *) ((*env)->GetStringUTFChars(env, jargv[i], 0));
        LOGE("argv[%d] (len %d) = %s", i, strlen(argv[i]), argv[i]);
    }

    int res = runmain(argc, argv);

    for (int i = 0; i < argc; i++) {
        (*env)->ReleaseStringUTFChars(env, jargv[i], (const jchar *) argv[i]);
    }

    return res;
}
