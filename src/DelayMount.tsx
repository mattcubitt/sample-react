import { useState, useEffect } from "react";

const DelayMount: React.FC = ({ children }) => {
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowChildren(true), 1000);

    return () => clearTimeout(timer);
  });

  if (!showChildren) {
    return null;
  }

  return <>{children}</>;
};

export default DelayMount;
