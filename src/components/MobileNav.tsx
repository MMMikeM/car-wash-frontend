import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from '@/components/ui/drawer'

const linkClass =
  'flex items-center px-4 py-4 text-base text-foreground! no-underline! hover:bg-accent hover:text-accent-foreground! rounded-md transition-colors shrink-0'

// `Close` differs per presentation but the list does not; taking it as a prop
// keeps one copy of the links.
const NavLinks = ({ links, Close }) => (
  <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
    {links.map((link) => (
      <Close key={link.path} render={<Link to={link.path} className={linkClass} />}>
        {link.name}
      </Close>
    ))}
  </nav>
)

/**
 * The navigation overflow panel, with its own trigger.
 *
 * Wrapping the trigger in the primitive's `Trigger` is the point of this
 * shape: it is what wires `aria-haspopup`, `aria-expanded` and the focus
 * return, none of which a bare button driven by an `isOpen` prop announces.
 *
 * Below `md` it is a bottom drawer, which is what a phone user expects from a
 * bottom tab bar and brings swipe-to-dismiss with it; above `md` it stays the
 * left sheet the desktop header has always used.
 */
const NavPanel = ({ links, trigger }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState(false)

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={trigger} />
        <SheetContent side="left" className="w-[280px] bg-card">
          <SheetHeader className="shrink-0">
            <SheetTitle className="text-primary">Carbon Car Wash</SheetTitle>
          </SheetHeader>
          <NavLinks links={links} Close={SheetClose} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={trigger} />
      <DrawerContent className="bg-card">
        <DrawerHeader className="shrink-0">
          <DrawerTitle className="text-primary">Carbon Car Wash</DrawerTitle>
        </DrawerHeader>
        <NavLinks links={links} Close={DrawerClose} />
      </DrawerContent>
    </Drawer>
  )
}

const NavToggle = ({ alwaysVisible = false }) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      'text-primary hover:text-primary hover:bg-primary/10',
      !alwaysVisible && 'lg:hidden'
    )}
    aria-label="Open menu"
  >
    <Menu className="size-6" />
  </Button>
)

export { NavPanel, NavToggle }
