import React from 'react'
import DataSet from './components/DataSet'
import LogsViewer from './components/LogsViewer';
import './App.css'

function App() {
  return (
    <div className='App'>
      <h1>Управление комментариями</h1>
      <DataSet />
      
      <div style={{ marginTop: '40px' }}>
        <LogsViewer />
      </div>
    </div>
  );
}

export default App
