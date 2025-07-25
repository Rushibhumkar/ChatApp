import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {color} from '../const/color';
import {myConsole} from '../utils/myConsole';

interface CustomStepperProps {
  labels?: string[];
  currentStep?: number;
  onStepPress?: (step: number) => void;
}

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: color.mainColor,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: color.mainColor,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: color.mainColor,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: color.mainColor,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: color.mainColor,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: color.mainColor,
};

const CustomStepper: React.FC<CustomStepperProps> = ({
  labels = [],
  currentStep = 0,
  onStepPress,
}) => {
  const [currentPosition, setCurrentPosition] = useState(currentStep);
  const validLabels = labels.filter(label => label !== undefined);
  useEffect(() => {
    setCurrentPosition(currentStep);
  }, [currentStep]);
  return (
    <View>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={validLabels}
        stepCount={validLabels.length}
        onPress={() => {}}
      />
    </View>
  );
};

export default CustomStepper;
