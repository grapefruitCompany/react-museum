import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import MainPage from '../MainPage';
import ArtObjectDetails from '../ArtObjectDetails';

class Routing extends React.Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={ MainPage } />
          <Route path="/:objectnumber" component={ ArtObjectDetails } />
        </Switch>
      </main>
    );
  }
}

export default Routing;
