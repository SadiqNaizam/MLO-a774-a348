import React from 'react';
import { cn } from '@/lib/utils';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: `h${HeadingLevel}`; // Allow overriding the tag for semantic purposes
  children: React.ReactNode;
  className?: string;
  // Add more style variants if needed, e.g., 'subtle', 'pageTitle'
}

const Heading: React.FC<HeadingProps> = ({
  level = 1,
  as,
  children,
  className,
  ...props
}) => {
  const Tag = as || (`h${level}` as keyof JSX.IntrinsicElements);
  console.log(`Rendering Heading as <${Tag}> with level ${level}`);

  const levelStyles: Record<HeadingLevel, string> = {
    1: "text-3xl sm:text-4xl font-bold tracking-tight",
    2: "text-2xl sm:text-3xl font-semibold tracking-tight",
    3: "text-xl sm:text-2xl font-semibold",
    4: "text-lg sm:text-xl font-medium",
    5: "text-base sm:text-lg font-medium",
    6: "text-sm sm:text-base font-medium",
  };

  return (
    <Tag
      className={cn(
        "text-gray-800 dark:text-white", // Base color
        levelStyles[level],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
export default Heading;