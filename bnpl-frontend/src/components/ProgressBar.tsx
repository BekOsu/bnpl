// src/components/ProgressBar.tsx
import React from "react";

interface Props {
  value: number;
  total: number;
}

const ProgressBar: React.FC<Props> = ({ value, total }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="w-full">
      <progress
        className="progress progress-success w-full"
        value={percentage}
        max={100}
      />
      <div className="text-sm text-center mt-1 text-gray-600">
        {value} of {total} installments paid ({percentage}%)
      </div>
    </div>
  );
};

export default ProgressBar;
