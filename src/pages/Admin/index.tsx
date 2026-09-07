import React from 'react'
import HomeTile from '@/components/HomeTile'
import { ListOrdered, Settings, UserCheck } from 'lucide-react'

const AdminHome = () => {
  const cards = [
    {
      name: 'Search Customers',
      img: '/search.jpg',
      path: '/customers/search',
    },
    {
      name: 'List Customers',
      img: '/customers.jpg',
      path: '/customers',
    },
    {
      name: 'Washes Report',
      img: '/reports.jpg',
      path: '/reports/washes',
    },
    {
      name: 'Daily Wash Summary',
      img: '/washes.jpg',
      path: '/reports/daily_washes',
    },
    {
      name: 'Wash Prices',
      img: '/prices.jpg',
      path: '/wash_types',
    },
    {
      name: 'Users',
      img: '/users.jpg',
      path: '/settings/users',
    },
    {
      name: 'Active Users',
      Icon: UserCheck,
      path: '/reports/active_users',
    },
    {
      name: 'Wash Order',
      Icon: ListOrdered,
      path: '/wash_order',
    },
    {
      name: 'Settings',
      Icon: Settings,
      path: '/settings',
    },
  ]

  return (
    <div className="w-full">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4">
        {cards.map((item) => (
          <HomeTile key={item.path} {...item} />
        ))}
      </div>
    </div>
  )
}

export default AdminHome
