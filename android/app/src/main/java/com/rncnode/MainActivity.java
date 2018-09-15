package com.rncnode;

import android.os.Bundle; // 启动屏相关
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // 启动屏相关

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
        SplashScreen.show(this); // 关键
        super.onCreate(savedInstanceState);
    }
}
