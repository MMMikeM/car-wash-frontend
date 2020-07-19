import React from 'react'
import './css/main.css'
import Login from './components/login'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CustomersIndex from './pages/Customers/index'
import CustomersEdit from './pages/Customers/edit'
import CustomersNew from './pages/Customers/new'
import CustomersSearch from './pages/Customers/search'
import VehicleNew from './pages/Vehicles/new'

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/customers/new">Add Customer</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/customers/new">
          <CustomersNew />
        </Route>
        <Route path="/customers/:id/edit">
          <CustomersEdit />
        </Route>
        <Route path="/customers/:id/vehicles/new">
          <VehicleNew />
        </Route>
        <Route path="/">
          <CustomersSearch />
          <CustomersIndex />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
