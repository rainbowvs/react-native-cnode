import React from 'react';
import {
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor';
import Header from '../coms/Header';
import ViewUtils from '../coms/ViewUtils';

export default class Publish extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    this.state = {
      themeColor
    };
    this.editor = null;
  }

  componentDidMount() {
    //
  }

  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //
    });
    this.richtext.setContentFocusHandler(() => {
      //
    });
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, authorName } = this.state;
    return (
      <View>
        <Header
          title="发表主题"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
        />
        <RichTextEditor
          ref={editor => this.editor = editor}
          initialTitleHTML="Title!!"
          initialContentHTML="Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>"
          editorInitializedCallback={() => this.onEditorInitialized()}
        />
        <RichTextToolbar
          getEditor={() => this.editor}
        />
      </View>
    );
  }
}

Publish.propTypes = {
  navigation: PropTypes.object.isRequired
};
