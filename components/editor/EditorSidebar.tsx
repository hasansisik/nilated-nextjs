"use client";

import { ReactNode } from "react";
import { useEditor } from "./EditorProvider";

interface EditorSidebarProps {
  children: ReactNode | ((data: any) => ReactNode);
  className?: string;
}

export default function EditorSidebar({ children, className = "p-3 space-y-6" }: EditorSidebarProps) {
  const { sectionData } = useEditor();

  return (
    <div className={`h-full overflow-auto ${className}`}>
      {typeof children === 'function' 
        ? children(sectionData) 
        : children
      }
    </div>
  );
} 