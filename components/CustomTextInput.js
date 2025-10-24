import React, { useState } from 'react';
import { TextInput as RNTextInput } from 'react-native-paper';
import { colorred } from '../constant/color';

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  mode = 'outlined',
  secureTextEntry = false,
  theme,
  ...props
}) => {
  // Custom theme with forced white background
  const customTheme = {
    ...theme,
    colors: {
      ...theme?.colors,
      background: '#ffffff', // Force white background
      surface: '#ffffff',    // Force white surface
      primary: colorred,     // Keep primary color as red
      accent: colorred,      // Keep accent color as red
    }
  };

  // Track password visibility locally when secureTextEntry is enabled
  const [showPassword, setShowPassword] = useState(false);

  return (
    <RNTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode={mode}
      theme={customTheme}
      secureTextEntry={secureTextEntry && !showPassword}
      style={{
        backgroundColor: '#ffffff', // Force white background
      }}
      underlineColor="transparent"
      activeUnderlineColor={colorred}
      textColor="#000000"
      right={
        secureTextEntry
          ? (
            <RNTextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword((prev) => !prev)}
              forceTextInputFocus={false}
            />
          )
          : null
      }
      {...props}
    />
  );
};

export default CustomTextInput;
