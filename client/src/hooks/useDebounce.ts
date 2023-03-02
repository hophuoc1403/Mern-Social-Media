import { useEffect, useState } from "react";

export default function useDebounce(value: any, duration: number = 800) {
  const [debounceValue, setDebounceValue] = useState(value);
  const [status, setStatus] = useState<"pending" | "fulfilfed" | "idle">(
    "idle"
  );
  

  useEffect(() => {
    setStatus("pending");

    const timer = setTimeout(() => {
      setDebounceValue(value);
      setStatus("fulfilfed");
    }, duration);
    return () => {
      clearTimeout(timer);
      setStatus("idle");
    };
  }, [value]);

  if (value === "") {
    return value;
  }
  
  return [debounceValue, status] as const;
}
