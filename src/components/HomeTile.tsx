import React from 'react'
import { Link } from 'react-router-dom'

const tileClass =
  'shadow-custom relative aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-2xl border-[1px] border-white/10 no-underline! transition hover:-translate-y-1 hover:border-primary/50 active:translate-y-0'
const titleClass =
  'font-heading mb-0! leading-tight uppercase tracking-wide text-lg! sm:text-xl!'

const Face = ({ name, img, Icon }) =>
  img ? (
    <React.Fragment>
      <img alt="" src={img} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <h2 className={`${titleClass} absolute inset-x-0 bottom-0 px-3 py-3 text-white`}>
        {name}
      </h2>
    </React.Fragment>
  ) : (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-3">
      <Icon className="h-10 w-10 text-primary" />
      <h2 className={`${titleClass} text-center text-foreground`}>{name}</h2>
    </div>
  )

const HomeTile = ({ name, path, img = null, Icon = null, onClick = null }) => {
  const className = `${tileClass}${img ? '' : ' bg-card'}`
  const face = <Face name={name} img={img} Icon={Icon} />

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} block w-full`}>
        {face}
      </button>
    )
  }

  return (
    <Link to={path} className={className}>
      {face}
    </Link>
  )
}

export default HomeTile
