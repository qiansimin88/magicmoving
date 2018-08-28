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
  Modal,
  FlatList,
  TouchableOpacity
} from 'react-native';

export default class MagicMoving extends Component {
  constructor ( props ) {
    super( props )
    this.state = {
      showPopupLayer: false //浮层开关
    }
    this._cardRefs = []  //保存Item的ref集合
  }
  //最终的渲染
  render() {
    return (
      <View>
        { this._renderList() }
        { this._renderPopupLayer() }
      </View>
    )
  }
  
  componentDidMount () {
  }

  //浮层关闭通知
  _onRequestClose  = () => {
    console.log( '浮层关闭' )
  }

//单个Item点击事件
  _onPressItem = ( index ) => {
    console.log( index )
  }

  //列表中的单个Item
  _renderItem = ( { item, index } ) => {
    //   itemStyle: item的样式
    //   renderItemView: item具体内容
      const { itemStyle, renderItemView } = this.props
    return (
        <TouchableOpacity
            style = { itemStyle }
            ref = { _ => this._cardRefs[index] = _ }
            onPress = { () => this._onPressItem( index ) }
        >
            <View>
                <Text>
                    1111
                </Text>
            </View>
        </TouchableOpacity>
    )
  } 

  //长列表
  _renderList () {
    const { data } = this.props  //传入的数据

    return (
        <FlatList
            data={ data }
            keyExtractor = { ( item, index ) =>  index }
            renderItem = { this._renderItem }
        />
    )
  }

  //浮层
  _renderPopupLayer () {
    const { showPopupLayer } = this.state
    return (
      <Modal
        transparent={ true } //透明
        visible={ showPopupLayer }
        onRequestClose = { this._onRequestClose }
      >
        <Text>
          哈哈哈
        </Text>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({

});
