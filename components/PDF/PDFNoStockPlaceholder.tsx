import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { Line, Path, Polyline, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: DESIGN_TOKENS.colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  text: {
    fontSize: 8,
    color: DESIGN_TOKENS.colors.gray[400],
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 4,
  },
});

export const PDFNoStockPlaceholder: React.FC = () => {
  const strokeColor = DESIGN_TOKENS.colors.gray[300]; // Lighter gray to match opacity-50

  return (
    <View style={styles.container}>
      <Svg width={32} height={32} viewBox="0 0 24 24">
        {/* Box Outline */}
        <Path
          d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Top Diagonal */}
        <Path
          d="m7.5 4.27 9 5.15"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner Lines */}
        <Polyline
          points="3.29 7 12 12 20.71 7"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Line
          x1="12"
          y1="22"
          x2="12"
          y2="12"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* The X */}
        <Path
          d="m17 13 5 5m-5 0 5-5"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <Text style={styles.text}>INDISPONÍVEL</Text>
    </View>
  );
};
