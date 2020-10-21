import React from 'react'
import { Link } from 'react-router-dom'

const AdminHome = () => {
  const cards = [
    {
      name: 'List Customers',
      img: 'public/customers.jpg',
      path: '/customers',
    },
    {
      name: 'Search Customers',
      img: 'public/search.jpg',
      path: '/customers/search',
    },
    {
      name: 'Washes Report',
      img: 'public/reports.jpg',
      path: '/reports/washes',
    },
    {
      name: 'Wash Prices',
      img: 'public/prices.jpg',
      path: '/wash_types',
    },
    {
      name: 'Users',
      img: 'public/users.jpg',
      path: '/settings/users',
    },
  ]

  const card = (name, img, path, index) => {
    const capitalise = (input) => input.charAt(0).toUpperCase() + input.slice(1)
    return (
      <Link to={path} className="text-decoration-none" key={index}>
        <div className="text-8 bg-4 m-3 rounded">
          <img
            src={img}
            width="180px"
            className="border-primary border-bottom rounded-top"
          />
          <h6 className="m-3 font-weight-black pb-4">{capitalise(name)}</h6>
        </div>
      </Link>
    )
  }

  return (
    <div className="w-100">
      <div className="d-flex flex-row justify-content-center flex-wrap">
        <img
          alt="Company logo"
          src="public/logo.png"
          style={{ width: '200px' }}
          className="mx-auto mb-5"
        />
      </div>
      <div className="d-flex flex-row justify-content-center flex-wrap">
        {cards.map((item, index) =>
          card(item.name, item.img, item.path, index)
        )}
      </div>
    </div>
  )
}

export default AdminHome
