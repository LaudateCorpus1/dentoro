import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import LoginPage from '../pages/logIn';
import IsAuthContext from '../components/context/isAuthContext';
import Sidebar from '../components/Sidebar';

const TodaySchedule = () => <h3>Today Schedule</h3>;
const Patients = () => <h3>Patients</h3>;
const Calender = () => <h3>Calender</h3>;

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = async () => {
    try {
      await axios('/api/v1/is-auth');
      setIsAuth(true);
    } catch ({ response }) {
      setIsAuth(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  console.log(isAuth);

  return (
    <div className="App">
      <IsAuthContext.Provider value={{ setIsAuth }}>
        <Switch>
          <Route exact path="/">
            Home
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route path="/dashboard">
            <Sidebar>
              <Switch>
                <Route exact path="/dashboard">
                  <TodaySchedule />
                </Route>
                <Route exact path="/dashboard/calender">
                  <Calender />
                </Route>
                <Route exact path="/dashboard/patients">
                  <Patients />
                </Route>
                <Redirect to="/404" />
              </Switch>
            </Sidebar>
          </Route>
          <Route>
            <h1>Error 404 Not Found !!</h1>
          </Route>
        </Switch>
      </IsAuthContext.Provider>
    </div>
  );
};

export default App;
