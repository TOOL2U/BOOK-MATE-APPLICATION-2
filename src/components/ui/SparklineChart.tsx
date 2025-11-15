import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient as SvgLinearGradient, Stop, Path } from 'react-native-svg';
import { COLORS } from '../../config/theme';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showGradient?: boolean;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  width = 120,
  height = 40,
  color = COLORS.BRAND_YELLOW,
  showGradient = true,
}) => {
  if (!data || data.length === 0) return null;

  // Normalize data to fit within the chart height
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Create path for gradient fill
  const firstPoint = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return index === 0 ? `M${x},${y}` : `L${x},${y}`;
  }).join(' ');
  
  const gradientPath = `${firstPoint} L${width},${height} L0,${height} Z`;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgLinearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Gradient fill under the line */}
        {showGradient && (
          <Path
            d={gradientPath}
            fill="url(#sparklineGradient)"
          />
        )}
        
        {/* Line */}
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
