import React from 'react'
import { NavLink } from 'react-router-dom'
import { Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NavPanel } from './MobileNav'

const tabClass =
  'flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3 text-xs! text-muted-foreground! no-underline! transition-colors hover:text-primary!'

const BottomNav = ({ links }) => {
  const tabs = links.filter((link) => link.Icon).slice(0, 4)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-[1px] border-primary/40 bg-[#181818]/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-stretch">
        {tabs.map(({ name, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(tabClass, isActive && 'text-primary!')
            }
          >
            <Icon className="size-6" />
            <span className="text-center leading-tight">{name}</span>
          </NavLink>
        ))}
        <NavPanel
          links={links}
          trigger={
            <Button
              variant="ghost"
              // Button's own shrink-0 and has-[>svg]:px-3 both fight the
              // flex-1 sizing this tab shares with its NavLink siblings.
              className={cn(
                'h-auto flex-col gap-1 rounded-none',
                tabClass,
                'shrink has-[>svg]:px-2'
              )}
            >
              <Ellipsis className="size-6" />
              <span className="leading-tight">More</span>
            </Button>
          }
        />
      </div>
    </nav>
  )
}

export default BottomNav
