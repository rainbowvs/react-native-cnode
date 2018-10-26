package com.rncnode;

import android.os.Bundle; // 启动屏相关
import com.facebook.react.ReactActivity;
import com.rncnode.module.ShareModule;
import com.umeng.socialize.UMShareAPI;
import org.devio.rn.splashscreen.SplashScreen; // 启动屏相关

import android.content.Intent;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "rnCnode";
    }

    /**
     * 显示启动屏
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, true); // 关键
        super.onCreate(savedInstanceState);
        ShareModule.initActivity(this);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 解决内存泄漏问题
        UMShareAPI.get(this).release();
    }
}
