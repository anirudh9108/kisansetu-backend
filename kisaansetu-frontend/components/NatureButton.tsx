import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function NatureButton({ title, onPress, icon = "arrow-forward", variant = "primary" }) {
  const isSecondary = variant === "secondary";
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isSecondary ? styles.secondaryButton : styles.primaryButton
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.text, 
        isSecondary ? styles.secondaryText : styles.primaryText
      ]}>
        {title}
      </Text>
      <View style={[
        styles.iconContainer,
        isSecondary ? styles.secondaryIconContainer : styles.primaryIconContainer
      ]}>
        <Ionicons 
          name={icon} 
          size={18} 
          color={isSecondary ? Colors.light.forest : Colors.light.mint} 
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 24,
    paddingRight: 8,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  primaryButton: {
    backgroundColor: Colors.light.forest,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.forest,
  },
  text: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 16,
    marginRight: 12,
  },
  primaryText: {
    color: Colors.light.background,
  },
  secondaryText: {
    color: Colors.light.forest,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  secondaryIconContainer: {
    backgroundColor: 'rgba(26, 47, 26, 0.1)',
  }
});
