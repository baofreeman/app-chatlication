"use client";

import { selectSidebar } from "@/lib/services/sidebarSlice";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { FaMoon } from "react-icons/fa";
import { IoIosSunny } from "react-icons/io";

import { useState } from "react";
import clsx from "clsx";

const MobileSidebar = () => {
  const { email, name, bio, theme } = useAuth();
  const isOpen = useSelector(selectSidebar);
  const dispacth = useDispatch();
  const [isTheme, setIsTheme] = useState<string | undefined>(theme);

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side={"left"}
        className={cn("w-[400px] border-none bg-white pl-6 pt-8", "sm:w-1/2")}
      >
        <SheetHeader>
          <div className="flex flex-col space-y-4 mb-8">
            <h3 className="font-bold">{name}</h3>
            <h3>{email}</h3>
            <span>{bio}</span>
          </div>
        </SheetHeader>
        {/* <Button
          variant={"destructive"}
          onClick={() => dispacth(setIsOpenOrClose(!isOpen))}
        >
          x
        </Button> */}
        <div className="relative flex items-center justify-center w-[3rem] h-[1.5rem] rounded-full border border-black">
          <FaMoon size={20} />
          <div
            className={clsx(
              "absolute size-[1.4rem] rounded-full bg-red-500 z-50 transition-all duration-500",
              {
                "left-[0.03rem]": theme === "light",
                "right-[0.03rem]": theme === "dark",
              }
            )}
          />
          <IoIosSunny size={20} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
