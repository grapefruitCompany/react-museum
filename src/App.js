import React, { Component } from 'react';
import './Styles/main.scss';
import Routing from './Components/Routing';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routing/>        
      </div>
    );
  }
}

export default App;
