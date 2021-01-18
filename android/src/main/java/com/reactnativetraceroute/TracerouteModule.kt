package com.reactnativetraceroute

import android.util.Log

import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap

class TracerouteResponse(val eventName: String, val reactContext: ReactApplicationContext) {
    var stdout = StringBuilder()
    var stderr = StringBuilder()
    var exitCode: Int? = null

    fun appendStdout(s: String) {
        stdout.append(s)
        emitUpdate()
    }

    fun appendStderr(s: String) {
        stderr.append(s)
        emitUpdate()
    }

    fun setExitcode(c: Int) {
        exitCode = c
        emitUpdate()
    }

    fun emitUpdate() {
        val params: WritableMap = Arguments.createMap()
        params.putString("stdout", stdout.toString())
        params.putString("stderr", stderr.toString())
        params.putString("exitcode", exitCode?.toString())
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventName, params)
    }
}

class TracerouteModule(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "Traceroute"
    }

    @ReactMethod
    fun doTraceroute(args: ReadableArray, promise: Promise) {
        var strargs = Array<String?>(args.size()) { i  -> args.getString(i) }
        Log.d(TracerouteModule.TAG, "doTraceroute " + strargs.joinToString(" "))
        val id = nextId()
        val eventName = "traceroute" + id
        var resp = TracerouteResponse(eventName, reactContext)
        Thread {
            nativeTraceroute(strargs, resp)
        }.start()
        promise.resolve(eventName)
    }

    @Synchronized
    fun nextId(): Int {
        return id++
    }

    
    external fun nativeTraceroute(args: Array<String?>, resp: TracerouteResponse): Int

    companion object
    {

        val TAG = "TracerouteModule"
        var id = 1

        // Used to load the 'native-lib' library on application startup.
        init
        {
            System.loadLibrary("traceroute")
        }
    }
    
}
