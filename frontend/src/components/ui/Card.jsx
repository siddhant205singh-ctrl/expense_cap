const Card = ({ children, className = '', header, padding = 'p-6' }) => {
  return (
    <div className={`glass-card ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
          {header}
        </div>
      )}
      <div className={padding}>
        {children}
      </div>
    </div>
  );
};

export default Card;
