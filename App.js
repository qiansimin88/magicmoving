/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal
} from 'react-native';
import MagicMoving from './src/MagicMoving.js';

export default class Demo extends Component {
  constructor ( props ) {
    super( props )
    this._allData = [ { name: 1, image: 'https://test-img.3dker.cn/13cd4a8456e07713e020ed4801d6e585@280w_210h_1e_1c_90q.src' }, { name: 2, image: 'https://test-img.3dker.cn/4d372c7ee04923ee47a716451164b5a6@280w_210h_1e_1c_90q.src' }, { name: 3, image: 'https://test-img.3dker.cn/b9a2898bc376f3ec7698c44d6655e883@280w_210h_1e_1c_90q.src' } ]
  }
  //最终的渲染
  render() {
    return (
      <View>
        <MagicMoving
          data = { this._allData }
          itemStyle = { styles.item }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    marginTop: 20,
    height: 100,
    marginHorizontal: 20,
    backgroundColor: '#FF2D2D'
  }
});
