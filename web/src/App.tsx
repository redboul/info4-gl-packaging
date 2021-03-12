import React from 'react';
import logo from './logo.svg';
import './App.css';
import GuestList from './guest-list/GuestList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div>
        <GuestList></GuestList>
      </div>
    </div>
  );
}

export default App;
