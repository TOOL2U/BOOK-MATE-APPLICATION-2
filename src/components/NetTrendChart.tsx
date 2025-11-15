import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../config/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type NetTrendPoint = {
  x: string;   // label, e.g. "1", "2", "Week 1", etc.
  value: number; // net result for that time bucket
  date: string;  // raw date if needed
};

interface NetTrendChartProps {
  data: NetTrendPoint[];
  height?: number;
}

const CHART_WIDTH = Dimensions.get('window').width - 80; // Account for padding
const CHART_HEIGHT = 260; // Increased to fit X-axis labels
const PADDING = { top: 20, right: 20, bottom: 45, left: 50 };

export default function NetTrendChart({ data, height = CHART_HEIGHT }: NetTrendChartProps) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animated glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  // Calculate scales
  const values = data.map(d => d.value);
  const minValue = Math.min(...values, 0); // Include 0 in range
  const maxValue = Math.max(...values, 0); // Include 0 in range
  
  // Expand range if values are too close
  let valueRange = maxValue - minValue;
  if (valueRange < 100) {
    // If range is tiny, make it at least 100
    const midpoint = (maxValue + minValue) / 2;
    valueRange = 100;
  }
  
  // Round to nice numbers for better scale
  const scaledMin = minValue < 0 ? Math.floor(minValue / 1000) * 1000 : 0;
  const scaledMax = Math.ceil(maxValue / 1000) * 1000;
  const finalRange = scaledMax - scaledMin || 1000; // Default to 1000 if no range

  const chartWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;

  // Generate points for the line
  const points = data.map((point, index) => {
    const cx = PADDING.left + (index / (data.length - 1 || 1)) * chartWidth;
    const cy = PADDING.top + chartHeight - ((point.value - scaledMin) / finalRange) * chartHeight;
    return { cx, cy, ...point };
  });

  // Create smooth curve path using bezier curves
  const createSmoothPath = () => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].cx} ${points[0].cy}`;

    let path = `M ${points[0].cx} ${points[0].cy}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Control points for smooth curve
      const controlX1 = current.cx + (next.cx - current.cx) / 3;
      const controlY1 = current.cy;
      const controlX2 = current.cx + (2 * (next.cx - current.cx)) / 3;
      const controlY2 = next.cy;

      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.cx} ${next.cy}`;
    }

    return path;
  };

  const pathData = createSmoothPath();

  // Y-axis labels (show 4 ticks)
  const yTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const value = scaledMin + ratio * finalRange;
    const y = PADDING.top + chartHeight - ratio * chartHeight;
    return { value, y };
  });

  // X-axis labels (show max 6 labels to avoid crowding)
  const xTickInterval = Math.ceil(data.length / 6);
  const xTicks = data.filter((_, i) => i % xTickInterval === 0 || i === data.length - 1);

  // Format currency
  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `฿${(value / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `฿${(value / 1000).toFixed(0)}K`;
    }
    return `฿${value.toFixed(0)}`;
  };

  // Latest point for glow animation
  const lastPoint = points[points.length - 1];

  // Animated values for glow
  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 12],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={CHART_WIDTH} height={height}>
        {/* Subtle horizontal grid lines */}
        {yTicks.map((tick, i) => (
          <Line
            key={`grid-${i}`}
            x1={PADDING.left}
            y1={tick.y}
            x2={CHART_WIDTH - PADDING.right}
            y2={tick.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <SvgText
            key={`y-label-${i}`}
            x={PADDING.left - 10}
            y={tick.y + 4}
            fill={COLORS.TEXT_SECONDARY}
            fontSize="10"
            textAnchor="end"
          >
            {formatCurrency(tick.value)}
          </SvgText>
        ))}

        {/* X-axis labels */}
        {xTicks.map((tick, i) => {
          const index = data.indexOf(tick);
          const point = points[index];
          return (
            <SvgText
              key={`x-label-${i}`}
              x={point.cx}
              y={height - PADDING.bottom + 20}
              fill={COLORS.TEXT_SECONDARY}
              fontSize="10"
              textAnchor="middle"
            >
              {tick.x}
            </SvgText>
          );
        })}

        {/* Line path */}
        <Path
          d={pathData}
          stroke={COLORS.BRAND_YELLOW}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points on the line (non-animated) */}
        {points.slice(0, -1).map((point, i) => (
          <Circle
            key={`point-${i}`}
            cx={point.cx}
            cy={point.cy}
            r={3}
            fill={COLORS.BRAND_YELLOW}
          />
        ))}

        {/* Animated glow on last point */}
        {lastPoint && (
          <>
            <AnimatedCircle
              cx={lastPoint.cx}
              cy={lastPoint.cy}
              r={glowRadius}
              fill={COLORS.BRAND_YELLOW}
              opacity={glowOpacity}
            />
            <Circle
              cx={lastPoint.cx}
              cy={lastPoint.cy}
              r={5}
              fill={COLORS.BRAND_YELLOW}
            />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_PRIMARY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 16,
    overflow: 'visible',
  },
  emptyText: {
    fontFamily: 'Aileron-Regular',
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 60,
  },
});
