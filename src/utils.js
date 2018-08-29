import { Dimensions } from 'react-native'

//获取屏幕宽高
export const DeviceSize = {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height
}

//实现一个插值的运动函数
export const Utils = {
    interpolate(animatedValue, inputRange, outputRange) {
        if(animatedValue && animatedValue.interpolate) {
            console.log(inputRange,outputRange )
          return animatedValue.interpolate({inputRange, outputRange});
        }
      }
}