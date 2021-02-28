import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";

export const useBouncedCallback = <T>(callback: (value: T) => void) => {
  const [value, setValue] = useState<T | null>(null);
  const debouncedRef = useRef(
    debounce(
      (debouncedValue) => {
        callback(debouncedValue);
      },
      500,
      {
        trailing: true,
      }
    )
  );

  useEffect(() => {
    debouncedRef.current(value);
  }, [value]);
  return setValue;
};
