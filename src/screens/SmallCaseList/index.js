import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
    AsyncStorage
} from 'react-native';
import axios from 'axios';

var Buffer = require('buffer/').Buffer 


class SmallCaseList extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      DATA: [
        'SCMO_0001',
        'SCMO_0002',
        'SCMO_0003',
        'SCMO_0004',
        'SCMO_0005',
        'SCMO_0006',
        'SCMO_0007',
        'SCMO_0008',
        'SCMO_0009',
        'SCMO_0010',
        'SCMO_0011',
        'SCMO_0012',
        'SCMO_0013',
        'SCMO_0014',
        'SCMO_0015',
        'SCMO_0016',
        'SCMO_0017',
        'SCMO_0018',
      ]
    }
  }

  static navigationOptions = ({navigation}) => {
    const { state, setParams } = navigation;
    return {
      title: 'smallcase(s)'
    }
  }

  handleIndividualSmallcase = (scid) => {
    this.props.navigation.navigate('smallCase', {scid});
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.grid}>
            {
              
              this.state.DATA.map((scid, idx) => {
                let src = `https://www.smallcase.com/images/smallcases/130/${scid}.png`;      
                return (
                  <TouchableWithoutFeedback
                    key={idx}
                    onPress={() => this.handleIndividualSmallcase(scid)}
                  >
                    <View style={[styles.cardStyle, { width: 130, height: 130, margin: 10 }]}>
                      <Image
                          style={[{ width: "100%", height: "100%", }]}
                          source={{uri: src}}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  cardStyle: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 3,
    borderColor: 'rgb(255, 255, 255)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height:2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20
  }
});

export default SmallCaseList;
