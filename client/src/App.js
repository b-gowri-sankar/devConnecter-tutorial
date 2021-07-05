import './App.css';
import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import store from './store';
import Alert from './components/layout/Alert';
import { Provider } from 'react-redux';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    // console.log('useEffect is called')
    store.dispatch(loadUser())
  },[])

  return (
    <Provider store={store}>
    <Router>
        <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
          <section className="container">
            <Alert />
          <Switch>
            <Route path='/register' exact component={Register} />
            <Route path='/login' exact component={Login} />
          </Switch>
        </section>
        </Fragment>
      </Router>
      </Provider>
  );
}

export default App;
