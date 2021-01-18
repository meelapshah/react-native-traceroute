#include <jni.h>
#include <android/log.h>
#include <string.h>
#include <stdio.h>

#include "traceroute.h"

#define TAG "traceroute-jni"

#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__);
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__);

#define MAX_LINE_LENGTH 1024

int printf(const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);

    char *buffer = (char *) malloc(MAX_LINE_LENGTH);
    int c = vsnprintf(buffer, MAX_LINE_LENGTH, fmt, ap);
    buffer[c] = '\0';

    va_end(ap);

    LOGE("printf(%s)", buffer);

    free(buffer);
    return 1;
}

int fprintf(FILE *fp, const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);

    char *buffer = (char *) malloc(MAX_LINE_LENGTH);
    int c = vsnprintf(buffer, MAX_LINE_LENGTH, fmt, ap);
    buffer[c] = '\0';
    va_end(ap);

    LOGE("fprintf(%s)", buffer);

    free(buffer);
    return 1;
}

int vfprintf(FILE *fp, const char *fmt, va_list args) {
    char *buffer = (char *) malloc(MAX_LINE_LENGTH);
    int c = vsnprintf(buffer, MAX_LINE_LENGTH, fmt, args);
    buffer[c] = '\0';

    LOGE("traceroute error message(vfprintf): %s", buffer);

    free(buffer);
    return 1;
}

void perror(const char *msg) {
    LOGE("traceroute error message(perror): %s", msg);
}

void exit(int status) {
    LOGE("traceroute error to exit program, status:%d", status);
}

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
