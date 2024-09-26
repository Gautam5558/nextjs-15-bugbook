import React from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps {
  onBottomReached: () => void;
  className?: string;
  children: React.ReactNode;
}

const InfiniteScrollContainer = ({
  children,
  onBottomReached,
  className,
}: InfiniteScrollContainerProps) => {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
      }
      onBottomReached();
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
};

export default InfiniteScrollContainer;
