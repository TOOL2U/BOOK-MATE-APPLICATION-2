import React from 'react';
import BMLogo from '../../assets/images/bm-logo.svg';

type LogoBMProps = {
  size?: number;
};

/**
 * BookMate Official BM Monogram Logo Component
 * 
 * IMPORTANT: This component renders the OFFICIAL BookMate "BM" logo.
 * DO NOT modify the logo design, proportions, or styling.
 * The logo is loaded as an SVG component from assets/images/bm-logo.svg
 * 
 * Usage:
 * <LogoBM size={80} />
 * <LogoBM size={48} />
 */
const LogoBM: React.FC<LogoBMProps> = ({ size = 128 }) => {
  return (
    <BMLogo width={size} height={size} />
  );
};

export default LogoBM;
