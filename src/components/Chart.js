import React,{ useCallback } from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Image,
    Dimensions,
    StyleSheet,
    Button,
    Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import DeviceInfo from 'react-native-device-info';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
let {height, width} = Dimensions.get('window');

export default function Chart(props) {

  return(
    <View>
      <LineChart
        key={Math.random()}
        data={props.data}
        width={width/1.1}
        height={180}
        yAxisLabel=""
        withHorizontalLabels={false}
        withInnerLines={false}
        withOuterLines={false}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `#314BFF`,
          labelColor: (opacity = 1) => `#FFFFFF`,
          propsForDots: {
            r: "0",
            strokeWidth: "0",
            stroke: "#314BFF"
          }
        }}
        bezier
        onDataPointClick={(value, dataset, getColor)=>console.log('Chat Click : ',value)}
        style={{
          marginVertical: 8,
          borderRadius: 0
        }}
        />
    </View>
  )
}

Chart.propTypes = {
  data: PropTypes.object
}

Chart.defaultProps = {
  data: {},
}
