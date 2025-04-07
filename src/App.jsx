import React from 'react'
import DataSet from './components/DataSet'
import './App.css'

const columns = ['Имя', 'Возраст', 'Город']
const data = [
	{ Имя: 'Даниил', Возраст: 20, Город: 'Новосибирск' },
	{ Имя: 'Роман', Возраст: 19, Город: 'Барнаул' },
	{ Имя: 'Илья', Возраст: 19, Город: 'Бийск' },
	{ Имя: 'Денис', Возраст: 20, Город: 'Новокузнецк'},
]

function App() {
	return (
		<div className='App'>
			<h1>Таблица ИП-311</h1>
			<DataSet columns={columns} data={data} />
		</div>
	)
}

export default App
