import React from 'react';
import { Skeleton } from 'antd';

interface SkeletonUiProps {
    numRows: number; 
  }
  
  const SkeletonUi: React.FC<SkeletonUiProps> = ({ numRows }) => (
    <Skeleton avatar paragraph={{ rows: numRows }} /> 
  );

export default SkeletonUi;