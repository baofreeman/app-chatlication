"use client";

import { navbar } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectSidebar, setIsOpenOrClose } from "@/lib/services/sidebarSlice";

const Sidebar = () => {
  const { friendRequests } = useAuth();
  const isOpen = useSelector(selectSidebar);
  const dispatch = useDispatch();

  return (
    <div className={cn("flex flex-col w-[120px]", "sm:w-[80px] p-4 space-y-4")}>
      <div
        className={cn(
          "w-full flex items-center justify-center",
          "hover:cursor-pointer"
        )}
        onClick={() => dispatch(setIsOpenOrClose(!isOpen))}
      >
        <GiHamburgerMenu size={24} />
      </div>
      <div className="w-full flex flex-col items-center justify-center space-y-8">
        {navbar.map((item) => (
          <Button
            key={item.name}
            variant={"outline"}
            className="relative flex items-center justify-center"
          >
            <>
              {<item.icon size={24} />}
              {item.notification && (
                <span className="absolute -top-2 right-0 size-4 rounded-full text-center">
                  {friendRequests?.length !== undefined &&
                  friendRequests?.length > 0
                    ? friendRequests?.length
                    : "0"}
                </span>
              )}
            </>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
