export const Loader = () => {
    return (
      <div className="absolute inset-0 grid place-content-center bg-transparent backdrop-blur-lg">
           <svg viewBox="25 25 50 50" className="loader-container">
          <circle cx={50} cy={50} r={20} className="loader" />
        </svg>
      </div>
    );
  };
  