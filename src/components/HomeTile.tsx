import React from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FaceProps {
  name: string
  img?: string | null
  Icon?: LucideIcon | null
}

/** Give it `path` for a Link, or `onClick` for a button. */
interface HomeTileProps extends FaceProps {
  path?: string
  onClick?: () => void
}

const tileClass =
  'shadow-custom relative aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 no-underline! transition hover:-translate-y-1 hover:border-primary/50 active:translate-y-0'
const titleClass =
  'font-heading mb-0! leading-tight uppercase tracking-wide text-lg! sm:text-xl!'

const Face = ({ name, img, Icon }: FaceProps) =>
  img ? (
    <React.Fragment>
      <img alt="" src={img} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
      <h2 className={`${titleClass} absolute inset-x-0 bottom-0 px-3 py-3 text-white`}>
        {name}
      </h2>
    </React.Fragment>
  ) : (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-3">
      <Icon className="size-10 text-primary" />
      <h2 className={`${titleClass} text-center text-foreground`}>{name}</h2>
    </div>
  )

const HomeTile = ({ name, path, img = null, Icon = null, onClick }: HomeTileProps) => {
  const className = `${tileClass}${img ? '' : ' bg-card'}`
  const face = <Face name={name} img={img} Icon={Icon} />

  if (onClick) {
    return (
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn('block h-auto w-full p-0', className)}
      >
        {face}
      </Button>
    )
  }

  return (
    <Link to={path} className={className}>
      {face}
    </Link>
  )
}

export default HomeTile
