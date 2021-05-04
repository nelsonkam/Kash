import React, {Component} from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  snapPoints: Array<string | number>;
};

class KBottomSheet extends Component<Props> {
  private readonly sheetRef: React.RefObject<BottomSheet>;
  private fall: Animated.Value<number>;

  constructor(props: any) {
    super(props);
    this.sheetRef = React.createRef();
    this.fall = new Animated.Value(1);
  }

  snapTo(index: number) {
    return this.sheetRef.current?.snapTo(index);
  }

  open() {
    return this.snapTo(0);
  }

  close() {
    return this.snapTo(this.props.snapPoints.length - 1);
  }

  renderShadow() {
    const animatedShadowOpacity = Animated.interpolateNode(this.fall, {
      inputRange: [0, 1],
      outputRange: [0.5, 0],
    });

    return (
      <Animated.View
        onTouchStart={() => this.close()}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            height: Animated.cond(
              Animated.lessThan(this.fall, 1),
              new Animated.Value('100%'),
              new Animated.Value(0),
            ),
          },
          {
            opacity: animatedShadowOpacity,
          },
        ]}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <BottomSheet
          ref={this.sheetRef}
          initialSnap={this.props.snapPoints.length - 1}
          callbackNode={this.fall}
          snapPoints={this.props.snapPoints}
          borderRadius={12}
          renderContent={() => this.props.children}
        />
        {this.renderShadow()}
      </React.Fragment>
    );
  }
}

export default KBottomSheet;
