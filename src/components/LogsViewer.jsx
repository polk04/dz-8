import React, { useState, useEffect } from 'react';
import './DataSet.css';

const LogsViewer = () => {
  const [logs, setLogs] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Загрузка логов каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/logs')
        .then(res => res.json())
        .then(data => {
          setLogs(data);
          setLastUpdate(Date.now());
        });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Группировка логов по источнику
  const logSources = logs.reduce((acc, log) => {
    acc[log.source] = (acc[log.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="logs-container">
      <h2>Логи приложения <small>(обновлено: {new Date(lastUpdate).toLocaleTimeString()})</small></h2>

      <div className="log-stats">
        {Object.entries(logSources).map(([source, count]) => (
          <span key={source} className="log-source-badge">
            {source}: {count}
          </span>
        ))}
      </div>

      <div className="log-table-container">
        <table>
          <thead>
            <tr>
              <th>Время</th>
              <th>Уровень</th>
              <th>Источник</th>
              <th>Сообщение</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 50).map(log => (
              <tr key={log.id} className={`log-row ${log.level.toLowerCase()}`}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.level}</td>
                <td>{log.source}</td>
                <td>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsViewer;