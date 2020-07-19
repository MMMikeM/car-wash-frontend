import React from 'react'

const Card = (props) => {
  return props.data.map((x) => {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{x}</h5>
          <p className="card-text">{`${x} times ${x} is equal to ${x * x}`}</p>
          <a href="#" className="btn btn-primary">
            This is a button
          </a>
        </div>
      </div>
    )
  })
}

export default Card
