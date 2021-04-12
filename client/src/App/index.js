import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { useAuth } from '../Context/isAuthContext';
import Sidebar from '../components/Sidebar';
import LoginPage from '../pages/logIn';
import TodaySchedule from '../pages/TodaySchedule';
import PatientProfile from '../pages/admin/PatientProfile';
import Patients from '../components/Patients';

import './App.css';

const Calender = () => <h3>Calender</h3>;

const App = () => {
  const [isAuth] = useAuth();

  console.log(isAuth);

  return (
    // const checkAuth = async () => {
    //   try {
    //     await axios('/api/v1/is-auth');
    //     setIsAuth(true);
    //   } catch ({ response }) {
    //     setIsAuth(false);
    //   }
    // };
    // useEffect(() => {
    //   checkAuth();
    // }, []);

    <div className="App">
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
              <Route exact path="/dashboard/patients/:patientId">
                <PatientProfile />
              </Route>
              <Redirect to="/404" />
            </Switch>
          </Sidebar>
        </Route>
        <Route>
          <h1>Error 404 Not Found !!</h1>
        </Route>
        <Redirect to="/404" />
      </Switch>
    </div>
  );
};

export default App;
