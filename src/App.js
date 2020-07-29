import React from 'react'
import './css/main.css'
import './css/base.css'
import Login from './components/login'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CustomersIndex from './pages/Customers/index'
import CustomersEdit from './pages/Customers/edit'
import CustomersNew from './pages/Customers/new'
import CustomersSearch from './pages/Customers/search'
import VehicleNew from './pages/Vehicles/new'
import WashesIndex from './pages/Washes/index'
import Washes from './pages/Washes/customerIndex'
import WashEdit from './pages/Washes/edit'
import WashNew from './pages/Washes/new'
import Add from './pages/Wash/add'

function App() {
  return (
    <Router>
      <nav className="bg-1 navbar border-bottom border-primary">
        <ul className="d-flex flex-row align-items-center py-3 px-5 mb-0 navbar-nav">
          <li>
            <Link className="nav-item mr-3 py-2 px-2" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="nav-item mr-3 py-2 px-2" to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link className="nav-item mr-3 py-2 px-2" to="/customers/">
              List Customers
            </Link>
          </li>
          <li>
            <Link className="nav-item mr-3 py-2 px-2" to="/customers/search">
              Search Customers
            </Link>
          </li>
          <li>
            <Link className="nav-item mr-3 py-2 px-2" to="/customers/new">
              Add Customer
            </Link>
          </li>
          <li>
            <Link className="nav-item mr-3 py-2 px-2" to="/wash_types/">
              Wash Prices
            </Link>
          </li>
          <li>
            <Link className="nav-item mr-3 py-2 px-2" to="/wash_types/new">
              Add Wash
            </Link>
          </li>
        </ul>
      </nav>
      <Add />
      <div className="container w-75 mt-5">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/customers/new">
            <CustomersNew />
          </Route>
          <Route path="/customers/search">
            <CustomersSearch />
          </Route>
          <Route path="/customers/:id/edit">
            <CustomersEdit />
          </Route>
          <Route path="/customers/:id/vehicles/new">
            <VehicleNew />
          </Route>
          <Route path="/customers/">
            <CustomersIndex />
          </Route>
          <Route path="/wash_types/:id/edit">
            <WashEdit />
          </Route>
          <Route path="/wash_types/new">
            <WashNew />
          </Route>
          <Route path="/wash_types/">
            <WashesIndex />
          </Route>
          <Route path="/">
            <Washes />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
