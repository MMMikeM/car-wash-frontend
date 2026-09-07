import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'

const MobileNav = ({ links, isOpen, setIsOpen }) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[280px] bg-card flex flex-col">
        <SheetHeader className="shrink-0">
          <SheetTitle className="text-primary">Carbon Car Wash</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1">
          {links.map((link, key) => (
            <SheetClose asChild key={key}>
              <Link
                to={link.path}
                className="flex items-center px-4 py-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors shrink-0"
              >
                {link.name}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

const NavToggle = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden text-primary hover:text-primary hover:bg-primary/10"
      onClick={onClick}
      aria-label="Open menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  )
}

export { MobileNav, NavToggle }
