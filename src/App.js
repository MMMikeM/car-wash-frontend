import React from 'react'
import './css/main.css'
import Login from './components/login'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CustomersIndex from './pages/Customers/index'
import VehiclesIndex from './pages/Vehicles/index'
import CustomersEdit from './pages/Customers/edit'
import CustomersNew from './pages/Customers/new'

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
          <li>
            <Link to="/vehicles/index">List Vehicles</Link>
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
        <Route path="/vehicles/index">
          <VehiclesIndex />
        </Route>
        <Route path="/">
          <CustomersIndex />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
