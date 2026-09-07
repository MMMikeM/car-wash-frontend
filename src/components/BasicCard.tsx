import React from 'react'

const Card = (props) => {
  let content = props.data.map((wash) => {
    return (
      <article
        className="shadow-custom flex flex-col justify-between rounded-2xl border-[1px] border-white/5 bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/40"
        key={wash.id}
      >
        <div>
          <h3 className="font-heading mb-0! text-2xl! uppercase tracking-wide text-foreground">
            {wash.name}
          </h3>
          {wash.description ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {wash.description}
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex items-end justify-between gap-4">
          {wash.points ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <img
                alt=""
                src="/coin.png"
                style={{ width: '18px', height: '18px' }}
              />
              {`Earn ${wash.points} coins`}
            </span>
          ) : (
            <span />
          )}
          <span className="font-heading text-4xl leading-none text-primary">
            {wash.price}
          </span>
        </div>
      </article>
    )
  })
  return <React.Fragment>{content}</React.Fragment>
}

export default Card
