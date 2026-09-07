import React from 'react'
import { NavLink } from 'react-router-dom'
import { Ellipsis } from 'lucide-react'

const tabClass =
  'flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3 text-xs! text-muted-foreground! no-underline! transition-colors hover:text-primary!'

const BottomNav = ({ links, onMore }) => {
  const tabs = links.filter((link) => link.Icon).slice(0, 4)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-[1px] border-primary/40 bg-[#181818]/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-stretch">
        {tabs.map(({ name, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            exact={path === '/'}
            className={tabClass}
            activeClassName="text-primary!"
          >
            <Icon className="h-6 w-6" />
            <span className="text-center leading-tight">{name}</span>
          </NavLink>
        ))}
        <button type="button" onClick={onMore} className={tabClass}>
          <Ellipsis className="h-6 w-6" />
          <span className="leading-tight">More</span>
        </button>
      </div>
    </nav>
  )
}

export default BottomNav
