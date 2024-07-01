"use client";
import { useEffect } from "react";

interface ContainerProps {
  children: React.ReactNode
};

export const Container = ({
  children
}: ContainerProps) => {

  return (
    <div className="container relative flex-col items-center justify-center">
      {children}
    </div>
  );
};