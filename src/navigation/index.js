import { StackNavigator } from 'react-navigation';

import SmallCaseList from '../screens/SmallCaseList';
import SmallCase from '../screens/SmallCase';


const MainNavigator = StackNavigator({
    root: {
        screen: SmallCaseList
    },
    smallCase: {
        screen: SmallCase
    }
})

export default MainNavigator;