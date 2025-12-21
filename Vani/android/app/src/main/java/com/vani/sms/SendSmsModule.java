package com.vani.sms;

import android.telephony.SmsManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SendSmsModule extends ReactContextBaseJavaModule {

    public SendSmsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "SendSms";
    }

    @ReactMethod
    public void sendSms(String phoneNumber, String message, Promise promise) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(
                    phoneNumber,
                    null,
                    message,
                    null,
                    null
            );
            promise.resolve(true);
        } catch (Exception e) {
            Log.e("SendSms", "SMS failed", e);
            promise.reject("SMS_FAILED", e);
        }
    }
}
