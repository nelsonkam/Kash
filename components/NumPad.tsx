import * as React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  ViewStyle,
  StyleProp,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/colors';

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  display: {
    padding: 20,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  activeDisplay: {
    backgroundColor: '#f8f8f8',
  },
  activeDisplayText: {},
  invalidDisplayText: {},
  displayText: {
    fontSize: 30,
    color: '#666',
  },
  placeholderDisplayText: {
    color: '#ddd',
  },
  cursor: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  pad: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '33%',
  },
  buttonText: {
    color: '#888',
    fontSize: 26,
    textAlign: 'center',
  },
  hide: {
    paddingVertical: 5,
    alignItems: 'center',
  },
  blinkOn: {
    borderBottomColor: '#ddd',
  },
  blinkOff: {
    borderBottomColor: 'transparent',
  },
  cell: {
    width: `${100 / 3}%`,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  cellRow: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  cellText: {
    color: Colors.medium,
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
});
const inputs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0'];

type InputProps = {
  height: number;
  position: 'relative' | 'absolute';
  style?: StyleProp<ViewStyle>;
  backspaceIcon?: JSX.Element;
  hideIcon?: JSX.Element;
  onWillHide?: () => void;
  onDidHide?: () => void;
  onWillShow?: () => void;
  onDidShow?: () => void;
  onChange: (num: string) => void;
};

export default class OldPad extends React.Component<InputProps> {
  animation: Animated.Value;

  static defaultProps = {
    height: 270,
    position: 'absolute',
  };

  static iconStyle = {
    color: styles.buttonText.color || '#888',
    size: styles.buttonText.fontSize || 36,
  };

  constructor(props: InputProps) {
    super(props);

    this.animation = new Animated.Value(0);
  }

  show = () => {
    if (this.props.onWillShow) this.props.onWillShow();
    Animated.timing(this.animation, {
      duration: 200,
      toValue: this.props.height,
      useNativeDriver: true,
    }).start(this.props.onDidShow);
  };

  hide = () => {
    if (this.props.onWillHide) this.props.onWillHide();
    Animated.timing(this.animation, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }).start(this.props.onDidHide);
  };

  componentDidMount() {
    this.show();
  }

  componentWillUnmount() {
    Animated.timing(this.animation, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  getStyle = () => {
    const interpolation = this.animation.interpolate({
      inputRange: [0, this.props.height + 32],
      outputRange: [this.props.height + 32, 0],
    });
    return this.props.position === 'absolute'
      ? {
          height: this.props.height,
          transform: [
            {
              translateY: interpolation,
            },
          ],
        }
      : {
          height: interpolation,
        };
  };

  render() {
    return (
      <Animated.View style={[this.getStyle() as any, this.props.style]}>
        <View style={styles.input}>
          <View style={styles.pad}>
            {inputs.map((value, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.button}
                  onPress={() => this.props.onChange(value)}>
                  <Text style={styles.buttonText}>{value}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              key="backspace"
              style={styles.button}
              onPress={() => this.props.onChange('backspace')}>
              <Ionicons name={'backspace'} size={26} color={'#888'} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
}

const NumPad = ({onChange}) => {
  const size = Dimensions.get('window').width - 32;
  const handleInput = value => {
    onChange(value);
  };
  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <View style={{width: size, height: size * 0.8}}>
        <View style={styles.cellRow}>
          <TouchableOpacity
            onPress={() => handleInput('1')}
            style={styles.cell}>
            <Text style={styles.cellText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('2')}
            style={styles.cell}>
            <Text style={styles.cellText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('3')}
            style={styles.cell}>
            <Text style={styles.cellText}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cellRow}>
          <TouchableOpacity
            onPress={() => handleInput('4')}
            style={styles.cell}>
            <Text style={styles.cellText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('5')}
            style={styles.cell}>
            <Text style={styles.cellText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('6')}
            style={styles.cell}>
            <Text style={styles.cellText}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cellRow}>
          <TouchableOpacity
            onPress={() => handleInput('7')}
            style={styles.cell}>
            <Text style={styles.cellText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('8')}
            style={styles.cell}>
            <Text style={styles.cellText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('9')}
            style={styles.cell}>
            <Text style={styles.cellText}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cellRow}>
          <TouchableOpacity
            onPress={() => handleInput('00')}
            style={styles.cell}>
            <Text style={styles.cellText}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('0')}
            style={styles.cell}>
            <Text style={styles.cellText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('backspace')}
            style={styles.cell}>
            <Ionicons name={'backspace'} size={26} color={Colors.medium} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NumPad;
