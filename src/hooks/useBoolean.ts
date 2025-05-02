import { useCallback, useState } from "react";

const useBoolean = (init?: boolean) => {
  const [bool, setBool] = useState(init || false);

  const toggle = useCallback(() => setBool((prev) => !prev), []);
  const setTrue = useCallback(() => setBool(true), []);
  const setFalse = useCallback(() => setBool(false), []);

  return {
    value: bool,
    toggle,
    setTrue,
    setFalse,
    setBool,
  };
};

export default useBoolean;
