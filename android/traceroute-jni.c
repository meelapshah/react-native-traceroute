#include <jni.h>

#include <android/log.h>
#include <errno.h>
#include <malloc.h>
#include <pthread.h>
#include <stdio.h>
#include <string.h>

#include "traceroute.h"

#define TAG "traceroute-jni"

#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__);
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__);

#define JNI_VERSION JNI_VERSION_1_6
#define MAX_LINE_LENGTH 1024

static pthread_mutex_t trace_active;
static int trace_return = 0;

static JavaVM *jvm;
static jobject respRef;

jint JNI_OnLoad(JavaVM *vm, void *reserved) {
    jvm = vm;
    pthread_mutex_init(&trace_active, NULL);
    return JNI_VERSION;
}

void JNI_OnUnload(JavaVM *vm, void *reserved) {
    pthread_mutex_destroy(&trace_active);
}

JNIEnv *getJNIEnv() {
    JNIEnv *env = NULL;
    if ((*jvm)->GetEnv(jvm, &env, JNI_VERSION) != JNI_OK) {
        LOGE("GetEnv error %p", env);
        return NULL;
    }
    return env;
}

void append_stdout(const char *s) {
    JNIEnv *env = getJNIEnv();
    jclass respCls = (*env)->GetObjectClass(env, respRef);
    jmethodID appendStdout = (*env)->GetMethodID(env, respCls, "appendStdout", "(Ljava/lang/String;)V");
    if (appendStdout == NULL) {
        LOGE("no method appendStdout(String)");
        return;
    }
    jstring js = (*env)->NewStringUTF(env, s);
    (*env)->CallVoidMethod(env, respRef, appendStdout, js);
    (*env)->DeleteLocalRef(env, js);
}

void append_stderr(const char *s) {
    JNIEnv *env = getJNIEnv();
    jclass respCls = (*env)->GetObjectClass(env, respRef);
    jmethodID appendStderr = (*env)->GetMethodID(env, respCls, "appendStderr", "(Ljava/lang/String;)V");
    if (appendStderr == NULL) {
        LOGE("no method appendStderr(String)");
        return;
    }
    jstring js = (*env)->NewStringUTF(env, s);
    (*env)->CallVoidMethod(env, respRef, appendStderr, js);
    (*env)->DeleteLocalRef(env, js);
}

void set_exit_code(int code) {
    JNIEnv *env = getJNIEnv();
    jclass respCls = (*env)->GetObjectClass(env, respRef);
    jmethodID setExitCode = (*env)->GetMethodID(env, respCls, "setExitCode", "(I)V");
    if (setExitCode == NULL) {
        LOGE("no method setExitCode()");
        return;
    }
    (*env)->CallVoidMethod(env, respRef, setExitCode, code);
}

int printf(const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);

    char *buffer = (char *) malloc(MAX_LINE_LENGTH);
    int c = vsnprintf(buffer, MAX_LINE_LENGTH, fmt, ap);
    buffer[c] = '\0';

    va_end(ap);

    /* LOGE("printf(%s)", buffer); */
    append_stdout(buffer);

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

    /* LOGE("fprintf(%s)", buffer); */
    append_stderr(buffer);

    free(buffer);
    return 1;
}

int vfprintf(FILE *fp, const char *fmt, va_list args) {
    char *buffer = (char *) malloc(MAX_LINE_LENGTH);
    int c = vsnprintf(buffer, MAX_LINE_LENGTH, fmt, args);
    buffer[c] = '\0';

    /* LOGE("traceroute error message(vfprintf): %s", buffer); */
    append_stderr(buffer);

    free(buffer);
    return 1;
}

void perror(const char *msg) {
    LOGE("traceroute error message(perror): %s", msg);
    append_stderr(msg);
}

void exit(int status) {
    LOGE("traceroute error to exit program, status:%d", status);
    set_exit_code(0);
}

struct doTracerouteArgs {
    int argc;
    char **argv;
};

void *doTraceroute(void *arg) {
    JNIEnv *env = NULL;
    if ((*jvm)->AttachCurrentThread(jvm, &env, NULL) != JNI_OK) {
        LOGE("AttachCurrentThread failed");
        return NULL;
    }

    struct doTracerouteArgs *a = (struct doTracerouteArgs *)arg;
    int argc = a->argc;
    char **argv = a->argv;

    trace_return = runmain(argc, argv);
    set_exit_code(trace_return);

    (*jvm)->DetachCurrentThread(jvm);
    return NULL;
}

JNIEXPORT jint JNICALL
Java_com_reactnativetraceroute_TracerouteModule_nativeTraceroute(JNIEnv *env, jclass type, jobjectArray jarray, jobject resp) {
    if (EBUSY == pthread_mutex_trylock(&trace_active)) {
        LOGE("multiple concurrent traceroute not supported")
        return -1;
    }

    jint argc = (*env)->GetArrayLength(env, jarray);

    jstring jargv[argc];
    char *argv[argc];
    for (int i = 0; i < argc; i++) {
        jargv[i] = (jstring) ((*env)->GetObjectArrayElement(env, jarray, i));
        argv[i] = (char *) ((*env)->GetStringUTFChars(env, jargv[i], 0));
        LOGE("argv[%d] (len %d) = %s", i, strlen(argv[i]), argv[i]);
    }

    respRef = (*env)->NewGlobalRef(env, resp);

    pthread_t tid;
    struct doTracerouteArgs args = {
        .argc = (int) argc,
        .argv = argv
    };
    pthread_create(&tid, NULL, doTraceroute, (void *)&args);
    pthread_join(tid, NULL);

    for (int i = 0; i < argc; i++) {
        (*env)->ReleaseStringUTFChars(env, jargv[i], (const jchar *) argv[i]);
    }

    (*env)->DeleteGlobalRef(env, respRef);

    pthread_mutex_unlock(&trace_active);

    return trace_return;
}
