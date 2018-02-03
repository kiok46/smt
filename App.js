import React from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  NetInfo,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import MainNavigator from './src/navigation';


export default class App extends React.Component {

  state = {
    animation: new Animated.Value(0),
    isConnected: true
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.toggleWarning
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.toggleWarning
    );
  }

  toggleWarning = (isConnected) => {
    
    const toValue = isConnected ? 0 : 1

    Animated.timing(this.state.animation, {
      toValue,
      duration: 200
    }).start(() => {
      // Just a fake a rerender to awake the app.
      this.setState({
        isConnected: !this.state.isConnected
      })
    })
  }

  render() {

    const warningTransformInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0]
    })

    const warningTransformStyle = {
      transform: [
        {
          translateY: warningTransformInterpolate
        }
      ]
    }

    return (
        <View style={styles.container}>
          <MainNavigator/>
          <TouchableWithoutFeedback onPress={() => this.toggleWarning()}>
            <Animated.View style={[warningTransformStyle, styles.internetWarning]}>
              <Text style={{color: 'rgb(255, 255, 255)'}}>Internet is down. Only cached data is available.</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  internetWarning: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'tomato',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
