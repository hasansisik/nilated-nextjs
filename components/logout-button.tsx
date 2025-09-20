'use client';

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button 
      onClick={() => {}} 
      variant="ghost"
      size="sm"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  );
} 