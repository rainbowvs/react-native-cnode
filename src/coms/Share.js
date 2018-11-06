import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Toast from '../utils/toastUtils';
import IconFont from './IconFont';
import UShare, { SHARE_PLATFORM } from '../utils/shareUtils';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  shareBoardContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0'
  },
  shareItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80
  },
  shareItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20
  },
  shareItemIcon: {
    fontSize: 30,
    color: '#fff'
  },
  shareItemText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666'
  },
  cancelShareButton: {
    marginTop: 10,
    backgroundColor: '#fff'
  },
  cancelShareButtonText: {
    fontSize: 18,
    color: '#666',
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

const shareList = [
  { name: 'QQ', label: 'QQ', platform: SHARE_PLATFORM.QQ, color: '#00a4ff' },
  { name: 'wechat-fill', label: '微信', platform: SHARE_PLATFORM.WECHAT, color: '#25ab38' },
  { name: 'weibo', label: '微博', platform: SHARE_PLATFORM.SINA, color: '#d62829' }
];

const shareCallback = (onClose, platform, url = '', title = '', content = '', img = 'http://192.168.1.100:8082/rnwv/logo_300x300.png') => {
  switch (platform) {
    case SHARE_PLATFORM.QQ:
      UShare.share(
        title,
        content,
        url,
        img,
        platform,
        message => {
          Toast(message, { position: 0 });
          if (message === '分享成功') {
            onClose();
          }
        }
      );
      break;
    default:
      Toast('正在审核, 暂不开放', { position: 0 });
      break;
  }
};

const Share = props => {
  const { visible, onClose, params: { url, title, content, img } } = props;
  return (
    <Modal
      transparent
      hardwareAccelerated
      visible={visible}
      animationType="slide"
      onRequestClose={() => { onClose(); }}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => { onClose(); }}
        />
        <View style={styles.shareBoardContainer}>
          <ScrollView
            alwaysBounceVertical
            horizontal
            style={{ backgroundColor: '#fff' }}
          >
            {
              shareList && shareList.map(v => {
                return (
                  <TouchableOpacity
                    key={v.platform}
                    activeOpacity={0.2}
                    onPress={() => shareCallback(onClose, v.platform, url, title, content, img)}
                  >
                    <View style={styles.shareItemContainer}>
                      <View style={[styles.shareItem, { backgroundColor: v.color }]}>
                        <IconFont
                          name={v.name}
                          style={styles.shareItemIcon}
                        />
                      </View>
                      <Text style={styles.shareItemText}>{v.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => { onClose(); }}
            style={styles.cancelShareButton}
          >
            <Text style={styles.cancelShareButtonText}>取消分享</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

Share.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired
};

export default Share;
