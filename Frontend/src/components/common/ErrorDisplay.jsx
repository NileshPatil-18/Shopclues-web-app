const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="alert alert-danger" role="alert">
      <h5 className="alert-heading">Error</h5>
      <p>{error || "An unexpected error occurred"}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-warning mt-2">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;