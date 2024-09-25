import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      {children}
    </div>
  );
};

export default AuthLayout;
