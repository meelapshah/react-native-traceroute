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

import java.util.concurrent.atomic.AtomicBoolean

class TracerouteResponse(val reactContext: ReactApplicationContext) {
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
        TracerouteModule.inProgress.set(false);
        emitUpdate()
    }

    fun emitUpdate() {
        val params: WritableMap = Arguments.createMap()
        var output: String = stdout.toString()
        if (stderr.length > 0) {
          output += "\nerror:\n" + stderr.toString()
        }
        params.putString("output", output)
        params.putBoolean("done", if (exitCode == null) false else true)
        reactContext.getJSModule(
          DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
          ).emit(TracerouteModule.updateEvent, params)
    }
}

class TracerouteModule(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "TracerouteModule"
    }

    @ReactMethod
    fun doTraceroute(address: String, probeType: String, promise: Promise) {
        if (!TracerouteModule.inProgress.compareAndSet(false, true)) {
            promise.reject("EINPROGRESS", "Traceroute in progress.")
            return
        }
        val cliArgs = arrayOf<String>("traceroute", "-I", address)
        if (probeType == "udp") {
          cliArgs[1] = "-U"
        }
        Log.d(TracerouteModule.TAG, "doTraceroute " + cliArgs.joinToString(" "))
        Thread {
            nativeTraceroute(cliArgs, TracerouteResponse(reactContext))
        }.start()
        promise.resolve(null)
    }

    external fun nativeTraceroute(args: Array<String>, resp: TracerouteResponse): Int

    companion object
    {

        val TAG = "TracerouteModule"
        val updateEvent = "tracerouteUpdateEvent"
        val inProgress: AtomicBoolean = AtomicBoolean(false)


        // Used to load the 'native-lib' library on application startup.
        init
        {
            System.loadLibrary("traceroute")
        }
    }

}
