import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Defs, Filter, FeTurbulence } from 'react-native-svg';

interface PaperBackgroundProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

/**
 * A reusable background component that provides a subtle "grainy paper" texture
 * inspired by the Faseelh Framer template.
 */
export default function PaperBackground({ children, style }: PaperBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Texture Layer */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" opacity={0.03}>
          <Defs>
            <Filter id="noise">
              <FeTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </Filter>
          </Defs>
          <Rect width="100%" height="100%" filter="url(#noise)" fill="#888" />
        </Svg>
      </View>
      
      {/* Content Layer */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F1', // Paper White from constants
  },
});
