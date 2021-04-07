import * as React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

export default class NumPad extends React.Component<InputProps> {
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
