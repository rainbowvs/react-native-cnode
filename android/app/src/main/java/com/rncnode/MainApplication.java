package com.rncnode;

import android.app.Application;

import com.facebook.react.ReactApplication;
import org.reactnative.camera.RNCameraPackage;

import com.rncnode.module.SharePackage;
import com.umeng.socialize.Config;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;
import com.umeng.commonsdk.UMConfigure;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SharePackage(),
            new RNCameraPackage(),
            new SplashScreenReactPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Config.shareType = "react native";
    UMConfigure.init(this,"5bd1e59bb465f5db86000428","umeng",UMConfigure.DEVICE_TYPE_PHONE,"");
  }

  // 配置平台，将AppKey 和 AppSecret 换成你申请的即可
  // 【注意】QQ 和 QQ 空间是同一个设置（同一个key、AppSecret）
  {
    PlatformConfig.setWeixin("wx083bf496cbc48aec", "750e9075fa521c82274a9d548c399825");
    PlatformConfig.setQQZone("1106207359", "3JjbG8aXMuh5w0sV");
    PlatformConfig.setSinaWeibo("3371114989", "016bbc5205c4c3a59cbe34405b7498ae", "www.baidu.com");
  }
}
