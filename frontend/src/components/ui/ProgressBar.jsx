const ProgressBar = ({ progress, className = '', showLabel = true }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  let color = 'bg-primary-500';
  if (clampedProgress >= 100) {
    color = 'bg-red-500';
  } else if (clampedProgress >= 80) {
    color = 'bg-amber-500';
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{clampedProgress.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
