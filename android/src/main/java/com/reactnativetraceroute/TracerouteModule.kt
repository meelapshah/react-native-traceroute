package com.reactnativetraceroute

import android.util.Log

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.Promise

class TracerouteResponse {
    var stdout = StringBuilder();
    var stderr = StringBuilder();
    var exitCode: Int = 0;

    fun appendStdout(s: String) {
        stdout.append(s);
    }

    fun appendStderr(s: String) {
        stderr.append(s);
    }
}

class TracerouteModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "Traceroute"
    }

    @ReactMethod
    fun doTraceroute(args: ReadableArray, promise: Promise) {
        var strargs = Array<String?>(args.size()) { i  -> args.getString(i) }
        Log.d(TracerouteModule.TAG, "doTraceroute " + strargs.joinToString(" "))
        var resp = TracerouteResponse()
        promise.resolve(nativeTraceroute(strargs, resp))
    }

    
    external fun nativeTraceroute(args: Array<String?>, resp: TracerouteResponse): Int;

    companion object
    {

        val TAG = "TracerouteModule"

        // Used to load the 'native-lib' library on application startup.
        init
        {
            System.loadLibrary("traceroute")
        }
    }
    
}
