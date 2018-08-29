/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { DeviceSize, Utils } from './utils';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  UIManager,  //UI测量
  findNodeHandle,  //找节点
  Animated
} from 'react-native';

export default class MagicMoving extends Component {
  constructor ( props ) {
    super( props )
    this.state = {
        selectedIndex: 0,  //当前选中的 item节点的index
        showPopupLayer: false //浮层开关
    }
    this._cardRefs = []  //保存Item的ref集合
    this.popupAnimatedValue = new Animated.Value(0) //设置动画初始值
    this._popupLayerStyle = null  //动画的样式集合
  }
  //最终的渲染
  render() {
    return (
      <View style={ {backgroundColor: '#ffa6ff', position: 'relative'} }>
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
    //   this.popupAnimatedValue.setValue( 0 )
    // UIManager.measure( node, ( x, y. width, height, pageX, pageY ) => {} ) 获得页面信息  Node:节点  x,y, width, height, pageX, pageY 分别是相对父组件的X坐标 Y坐标 节点宽高  节点相对屏幕X，Y坐标
    //findNodeHandle 找节点
    UIManager.measure( findNodeHandle( this._cardRefs[index] ), ( x, y, width, height, pageX, pageY ) => {
        let v = this.popupAnimatedValue
        //这个样式 就是从当前ref节点的位置 铺满整个屏幕
        this._popupLayerStyle = {
            top: Utils.interpolate(this.popupAnimatedValue, [0, 1], [pageY, 0]),
            left: Utils.interpolate(this.popupAnimatedValue, [0, 1], [pageX, 0]),
            width: Utils.interpolate(this.popupAnimatedValue, [0, 1], [width, DeviceSize.WIDTH]),
            height: Utils.interpolate(this.popupAnimatedValue, [0, 1], [height, DeviceSize.HEIGHT])
        }

        //弹出浮层 设置当前index
        this.setState( {
            showPopupLayer: true,
            selectedIndex: index 
        }, () => {
            //然后运动  //弹簧运动  到1 摩擦系数6  start()开启运动
             Animated.spring(this.popupAnimatedValue, {toValue: 1, friction: 2, tension: 7 }).start( () => {
                 console.log( 4444 );
             } );
             console.log( this._popupLayerStyle )
        })
    })
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
        {
            showPopupLayer && (
                <Animated.View style = { [ styles.popupLayer, this._popupLayerStyle] }>
                    <View>
                        <Text>
                            hahah
                        </Text>
                    </View>
                </Animated.View>
            )
        }
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
//绝对布局 脱离文档流 好运动
popupLayer: { 
    height: 20,
    width: 5,
    backgroundColor: '#02DF82',
    position: 'absolute',
    overflow: 'hidden'
  }
});
