import React from 'react'

const Card = (props) => {
  let content = props.data
    .sort((a, b) => a.price - b.price)
    .map((wash, y) => {
      return (
        <div
          className=" card border-0 bg-3 border-custom font-weight-bold text-7 shadow-custom m-2 "
          key={y}
          style={{ width: '20rem' }}
        >
          <div className="card-body px-4 py-3 bg-3 border-custom d-flex flex-column justify-content-between">
            <h3 className="card-title text-grey font-heading font-weight-black mb-3  ">
              {wash.name}
            </h3>
            <h6>{wash.description}</h6>
            {wash.points ? (
              <div className="d-flex align-items-end justify-content-between">
                <div className="d-flex align-content-end">
                  <img
                    alt="icon"
                    src="/public/coin.png"
                    style={{ width: '24px', height: '24px' }}
                  />
                  <h5 className="card-text align-bottom font-heading font-weight-semiBold mb-0 mx-2 pt-1">{`Earn ${wash.points} coins`}</h5>
                </div>
                <h2 className="card-text h1 text-primary align-bottom pt-1 lh-1 font-heading font-weight-black">{`R${wash.price}.00`}</h2>
              </div>
            ) : (
              <div className="d-flex align-items-end justify-content-end">
                <h2 className="card-text h1 text-primary align-bottom pt-1 lh-1 font-heading font-weight-black">{`R${wash.price}.00`}</h2>
              </div>
            )}
          </div>
        </div>
      )
    })
  return <React.Fragment>{content}</React.Fragment>
}

export default Card
