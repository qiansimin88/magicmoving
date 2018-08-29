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
    this._allData = [ { name: 1 }, { name: 2 }, { name: 3 } ]
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
