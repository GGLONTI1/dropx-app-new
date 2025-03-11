import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const Loading = () => {
  const { theme } = useTheme();

  return (
    <div className="h-screen flex items-center justify-center">
      <Image
        src={"/three-dots.svg"}
        alt="loader"
        width={50}
        height={50}
        priority
        style={{
          width: "50px",
          height: "50px",
          filter: theme === "dark" ? "invert(1)" : "none",
        }}
      />
    </div>
  );
};

export default Loading;
