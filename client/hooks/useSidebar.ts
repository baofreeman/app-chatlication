"use client";

import { useCallback, useMemo, useState } from "react";

interface useSidebarProps {
  isOpenOrClose?: boolean;
  handleClick?: () => void;
}

export const useSidebar = (): useSidebarProps => {
  const [isOpenOrClose, setIsOpenOrClose] = useState<boolean>(false);

  const handleClick = useCallback((): void => {
    setIsOpenOrClose((prev) => !prev);
  }, []);

  return { isOpenOrClose, handleClick };
};
