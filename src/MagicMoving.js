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
  Image,
  TouchableOpacity,
  ScrollView,
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
    this.bannerImageAnimatedValue = new Animated.Value(0)  //banner的图片的动画
    this.closeAnimatedvAalue = new Animated.Value(0)  //关闭按钮的淡入
    this._popupLayerStyle = null  //弹框动画的样式集合
    this._bannerImageStyle = null  //弹框内部banner的样式
    this._closeBtnStyle = null

    this._onPressCloseHanlder = this._onPressCloseHanlder.bind( this )
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
    console.log( '浮层关闭' );
  }

  //处理动画的插值
  _updateAnimatedStyles ( x, y, width, height, pageX, pageY ) {
        //这个样式 就是从当前ref节点的位置 铺满整个屏幕
        this._popupLayerStyle = {
            top: Utils.interpolate(this.popupAnimatedValue, [0, 1], [pageY, 0]),
            left: Utils.interpolate(this.popupAnimatedValue, [0, 1], [pageX, 0]),
            width: Utils.interpolate(this.popupAnimatedValue, [0, 1], [width, DeviceSize.WIDTH]),
            height: Utils.interpolate(this.popupAnimatedValue, [0, 1], [height, DeviceSize.HEIGHT])
        }
        this._bannerImageStyle = {
            width: Utils.interpolate( this.bannerImageAnimatedValue, [0, 1], [ width,  DeviceSize.WIDTH] ),
            height: Utils.interpolate( this.bannerImageAnimatedValue, [0, 1], [ height,  DeviceSize.WIDTH * height / width ] ),
        }
        this._closeBtnStyle = {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 30,
            right: 30,
            opacity: Utils.interpolate( this.closeAnimatedvAalue, [0, 1], [0,1] )
        }
  }

//单个Item点击事件
  _onPressItem = ( index ) => {
    //   this.popupAnimatedValue.setValue( 0 )
    // UIManager.measure( node, ( x, y. width, height, pageX, pageY ) => {} ) 获得页面信息  Node:节点  x,y, width, height, pageX, pageY 分别是相对父组件的X坐标 Y坐标 节点宽高  节点相对屏幕X，Y坐标
    //findNodeHandle 找节点
    UIManager.measure( findNodeHandle( this._cardRefs[index] ), ( x, y, width, height, pageX, pageY ) => {
        let v = this.popupAnimatedValue
        // let duration = 3000
        this._updateAnimatedStyles( x, y, width, height, pageX, pageY )
        //弹出浮层 设置当前index
        this.setState( {
            showPopupLayer: true,
            selectedIndex: index 
        }, () => {
            //同步运动 Animated.paraller 
            //然后运动  //弹簧运动  到1 摩擦系数6  start()开启运动
            Animated.parallel( [
                //保持同步的插值 视觉统一
                Animated.spring( this.popupAnimatedValue, {toValue: 1, friction: 2, tension: 7, duration: 5000 }),
                Animated.spring( this.bannerImageAnimatedValue,  {toValue: 1, friction: 2, tension: 7, duration: 5000 } )
            ] ).start( () => {
                Animated.sequence([
                    Animated.timing( this.closeAnimatedvAalue, { toValue: 1, duration: 1000 } )
                ]).start( () => {
                    console.log('全部完成')
                } )
            } )
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
            <View style={ styles.item }>
                <Image source={ { uri: item.image } } style={ styles.itemImage }/>
                <Text>
                    { item.name }
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
    const { showPopupLayer, selectedIndex } = this.state
    const { data } = this.props;
    return (
      <Modal
        transparent={ true } //透明
        visible={ showPopupLayer }
        onRequestClose = { this._onRequestClose }
      >
        {
            showPopupLayer && (
                <Animated.View style = { [ styles.popupLayer, this._popupLayerStyle] }>
                    {
                        this._renderPopupLayerContent( data[ selectedIndex , selectedIndex] )
                    }
                </Animated.View>
            )
        }
      </Modal>
    )
  }

  //关闭按钮渲染
  _renderClose () {
    return (
        <Animated.View style={ this._closeBtnStyle }>
            <TouchableOpacity style={ styles.closeContainer } onPress={ this._onPressCloseHanlder }>
                <View style={[styles.forkLine, {top: +.5, transform: [{rotateZ: '45deg'}]}]}/>
                <View style={[styles.forkLine, {top: -.5, transform: [{rotateZ: '-45deg'}]}]}/>
            </TouchableOpacity>
        </Animated.View>
    )
  }

  //触发关闭
  _onPressCloseHanlder () {
    Animated.parallel( [
        //保持同步的插值 视觉统一
        Animated.spring( this.popupAnimatedValue, {toValue: 0}),
        Animated.spring( this.bannerImageAnimatedValue,  {toValue: 0} ),
        Animated.timing( this.closeAnimatedvAalue, { toValue: 0} )
    ] ).start( () => {
        this.setState({showPopupLayer: false});
    } )
  }

  //浮层内部内容
  _renderPopupLayerContent ( item, index ) {
      //banner和数据内容
    const { renderPopuLayerBannber, renderPopLayrConetnt } = this.props
    return (
        <ScrollView>
            <Animated.Image source={ { uri: item.image } } style={ this._bannerImageStyle }/>
            { this._renderClose() }
            <View>
                <Text>
                    { item.name }
                </Text>
            </View>
        </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
//绝对布局 脱离文档流 好运动
popupLayer: { 
    backgroundColor: '#02DF82',
    position: 'absolute',
    overflow: 'hidden'
},
closeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#666'
},
forkLine: {
    width: 10,
    height: 1,
    backgroundColor: '#FFF'
},
item: {
},
itemImage: {
    height:50
}
})
