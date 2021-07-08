import './App.css';
import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import store from './store';
import Alert from './components/layout/Alert';
import { Provider } from 'react-redux';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/profile'

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
              <Route path='/profile/:id' exact component={Profile} />
              <PrivateRoute path='/dashboard' exact component={Dashboard} />
              <PrivateRoute path='/create-profile' exact component={CreateProfile} />
              <PrivateRoute path='/edit-profile' exact component={EditProfile} />
              <PrivateRoute path='/add-experience' exact component={AddExperience} />
              <PrivateRoute path='/add-education' exact component={AddEducation} />
              <Route path='/profiles' exact component={Profiles} />
          </Switch>
        </section>
        </Fragment>
      </Router>
      </Provider>
  );
}

export default App;
