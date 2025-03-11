import Image from "next/image";
import React from "react";

const LoadingBlack = () => {
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
        }}
      />
    </div>
  );
};

export default LoadingBlack;
