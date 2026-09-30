'use client'

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <Navbar onToggleCategoryNav={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <CategoryNav 
        isOpenMobile={mobileMenuOpen} 
        onCloseMobile={() => setMobileMenuOpen(false)} 
      />
    </header>
  );
}