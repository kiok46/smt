import React from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    NetInfo,
    ScrollView,
    ActivityIndicator,
    TouchableWithoutFeedback,
    AsyncStorage
} from 'react-native';
import axios from 'axios';

import { StackedAreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

var Buffer = require('buffer/').Buffer 


class SmallCase extends React.Component {

  constructor(props){
    super(props)
  }

  state = {
    isLoading: true,
    imageURL: "",
    rationale: {},
    stats: [],
    success: true,
    chartData: []
  }

  static navigationOptions = ({navigation}) => {
    const { state, setParams } = navigation;
    return {
      title: 'smallcase'
    }
  }

  async componentDidMount() {
    const { scid } = this.props.navigation.state.params;
    
    try {
      const isConnected = await NetInfo.isConnected.fetch()
      let url = `https://www.smallcase.com/images/smallcases/130/${scid}.png`;
      let success_ = await AsyncStorage.getItem(`${scid}_success`)
      // console.log("Rest data is saved already?", success_);
      // console.log("Is network available?", isConnected);
      
      if(isConnected && !success_){
        const historicalResponse = await axios.get(`https://api-dev.smallcase.com/smallcases/historical?scid=${scid}`)
        const smallcaseResponse = await axios.get(`https://api-dev.smallcase.com/smallcases/smallcase?scid=${scid}`)
        const chartData = historicalResponse.data.data.points
        const smallcase = smallcaseResponse.data.data
        const rationale = smallcase.rationale
        const stats = smallcase.stats
        const success = smallcaseResponse.data.success

        const smallcase_url = await axios.get(url, {responseType: 'arraybuffer'})
                                .then(response => new Buffer(response.data, 'binary')
                                .toString('base64'))

        await AsyncStorage.setItem(`${scid}_image`, JSON.stringify(smallcase_url))
        await AsyncStorage.setItem(`${scid}_chartData`, JSON.stringify(chartData))
        await AsyncStorage.setItem(`${scid}_rationale`, JSON.stringify(rationale))
        await AsyncStorage.setItem(`${scid}_stats`, JSON.stringify(stats))
        await AsyncStorage.setItem(`${scid}_success`, JSON.stringify(success))

        this.setState({
          chartData,
          imageURL: this.props.navigation.state.params.smallcaseImage,
          imageURL: smallcase_url,
          isLoading: false,
          rationale,
          stats,
          success
        }, () => {
          // console.log("Image url in if statement: ", this.state.imageURL)
        })
      } else {

        let success_ = await AsyncStorage.getItem(`${scid}_success`)
        success_ = JSON.parse(success_)
        
        if (success_){
          const image = await AsyncStorage.getItem(`${scid}_image`)
          const chartData = await AsyncStorage.getItem(`${scid}_chartData`)
          const rationale = await AsyncStorage.getItem(`${scid}_rationale`)
          const stats = await AsyncStorage.getItem(`${scid}_stats`)

          image = JSON.parse(image)
          chartData = JSON.parse(chartData)
          rationale = JSON.parse(rationale)
          stats = JSON.parse(stats)

          this.setState({
            imageURL: image,
            chartData,
            rationale,
            stats,
            success_,
            isLoading: false,
          }, () => {
            // console.log("Image url in else statement:  ", this.state.imageURL)
          })
        }

      }
    } catch(e) {

      let success_ = await AsyncStorage.getItem(`${scid}_success`)
      if (success_){
        success_ = JSON.parse(success_)
        // console.log("Inside catch", success_);
      } else {
        // console.log("Inside catch, success not defined");
      }

      await AsyncStorage.setItem(`${scid}_success`, JSON.stringify(false))
      // console.log(e)
    }

  }

  renderCachedImage = () => {
    const { scid } = this.props.navigation.state.params;

    return (
      <Image
          resizeMode="stretch"
          style={{
              height: 250,
              width: '100%',
            }}
          source={{ uri: `data:image/png;base64,${this.state.imageURL}` }}
      />
    )
  }

  renderRationale = () => {

    const { rationale } = this.state;

    const rationaleViewStyle = {
      justifyContent: 'center',
      alignItems: 'center'
    }

    return (
      <View style={[styles.cardStyle, rationaleViewStyle]}>
          <Text style={[styles.headingStyle, {fontSize: 24, marginTop: 3}]}>Rationale</Text>
          <Text style={{padding: 5, color: 'rgba(130, 130, 130, 1)'}}>{rationale}</Text>
      </View>
    )
  }
  
  renderTable = () => {

    const { stats } = this.state;

    const tableItemStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 40,
      paddingHorizontal: 15,
    }

    const valueStyle = {
      fontSize: 14,
      flex: 3,
      justifyContent: 'flex-start',
      textAlign: 'left',
      color: 'rgba(130, 130, 130, 1)'
    }

    return (
      <View style={[styles.cardStyle]}>
        <Text style={[styles.headingStyle, {fontSize: 24, textAlign: 'center', marginTop: 3}]}>Stats</Text>
        <View style={tableItemStyle}>
            <Text style={styles.headingStyle}>Index Value</Text>
            <Text style={valueStyle}>{stats.indexValue}</Text>
        </View>
        <View style={tableItemStyle}>
            <Text style={styles.headingStyle}>Daily</Text>
            <Text style={valueStyle}>{stats.returns.daily}</Text>
        </View>
        <View style={tableItemStyle}>
            <Text style={styles.headingStyle}>Yearly</Text>
            <Text style={valueStyle}>{stats.returns.yearly}</Text>
        </View>
      </View>
    )
  }

  renderChart = () => {
    
    const { chartData } = this.state;

    const colors = [ 'tomato']
    const keys   = [ 'index']

    return (
      <View style={[styles.cardStyle]}>
        <StackedAreaChart
          style={ { height: 200, paddingTop: 10 } }
          data={ chartData }
          keys={ keys }
          colors={ colors }
          curve={ shape.curveNatural }
          showGrid={ false }
        />
      </View>
    )
  }

  render() {
    const { success } = this.state;

    if (this.state.isLoading) {
      return (
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <ActivityIndicator/>
        </View>
      )
    } else {

      return (
        <View style={styles.container}>
          <ScrollView style={{flex: 1}}>
            <View style={styles.cardStyle}>
              {this.renderCachedImage()}
            </View>
            {this.renderTable()}
            {this.renderRationale()}
            {this.renderChart()}
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingStyle: {
    fontSize: 16,
    flex: 2,
    fontWeight: '500',
    textAlign: 'left',
  },
  cardStyle: {
    backgroundColor: 'rgb(255, 255, 255)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height:2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 10
  }
});

export default SmallCase;
