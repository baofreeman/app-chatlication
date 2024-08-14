import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import React from "react";

const Social = () => {
  return (
    <div className="w-full">
      <Button variant={"outline"} size={"lg"} className="w-full">
        <FcGoogle size={24} />
      </Button>
    </div>
  );
};

export default Social;
