import React, { useState, useEffect } from 'react'
import './DataSet.css'

const API_URL = 'https://jsonplaceholder.typicode.com/comments'

const DataSet = () => {
	const [data, setData] = useState([])
	const [selectedRows, setSelectedRows] = useState(new Set())
	const [editingRow, setEditingRow] = useState(null)
	const [editText, setEditText] = useState('')
	const [editComment, setEditComment] = useState('')

	useEffect(() => {
		fetch(API_URL)
			.then(response => response.json())
			.then(data => setData(data.slice(0, 10)))
			.catch(error => console.error('Ошибка загрузки данных:', error))
	}, [])

	const handleRowSelect = (rowIndex, event) => {
		setSelectedRows(prev => {
			const newSelection = new Set(prev)
			if (event.ctrlKey || event.metaKey) {
				if (newSelection.has(rowIndex)) {
					newSelection.delete(rowIndex)
				} else {
					newSelection.add(rowIndex)
				}
			} else {
				newSelection.clear()
				newSelection.add(rowIndex)
			}
			return newSelection
		})
	}

	const handleAdd = () => {
		const newComment = {
			postId: 1,
			id: Date.now(),
			name: 'Новый комментарий',
			body: 'Текст комментария',
		}
		setData(prev => [newComment, ...prev])
		fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newComment),
		})
			.then(response => response.json())
			.catch(() =>
				setData(prev => prev.filter(item => item.id !== newComment.id))
			)
	}

	const handleDelete = () => {
		const sortedIndexes = Array.from(selectedRows).sort((a, b) => b - a)
		const updatedData = data.filter((_, index) => !selectedRows.has(index))
		setData(updatedData)

		sortedIndexes.forEach(rowIndex => {
			const itemToDelete = data[rowIndex]
			fetch(`${API_URL}/${itemToDelete.id}`, { method: 'DELETE' }).catch(() =>
				setData(prev => [...prev, itemToDelete])
			)
		})

		setSelectedRows(new Set())
	}

	const handleEdit = rowIndex => {
		setEditingRow(rowIndex)
		setEditText(data[rowIndex].name)
		setEditComment(data[rowIndex].body)
	}

	const handleSave = rowIndex => {
		const updatedData = [...data]
		updatedData[rowIndex] = {
			...updatedData[rowIndex],
			name: editText,
			body: editComment,
		}

		setData(updatedData)
		setEditingRow(null)

		fetch(`${API_URL}/${updatedData[rowIndex].id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: editText, body: editComment }),
		}).catch(() => setData([...data]))
	}

	return (
		<div>
			<button onClick={handleAdd}>Добавить</button>
			<button onClick={handleDelete} disabled={selectedRows.size === 0}>
				Удалить
			</button>
			<table className='dataset-table'>
				<thead>
					<tr>
						<th></th>
						<th>ID</th>
						<th>Имя</th>
						<th>Комментарий</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr
							key={row.id}
							className={selectedRows.has(rowIndex) ? 'highlight' : ''}
						>
							<td
								className='select-area'
								onClick={event => handleRowSelect(rowIndex, event)}
							></td>
							<td>{row.id}</td>
							<td>
								{editingRow === rowIndex ? (
									<input
										type='text'
										value={editText}
										onChange={e => setEditText(e.target.value)}
									/>
								) : (
									row.name
								)}
							</td>
							<td>
								{editingRow === rowIndex ? (
									<textarea
										value={editComment}
										onChange={e => setEditComment(e.target.value)}
									/>
								) : (
									row.body
								)}
							</td>
							<td>
								{editingRow === rowIndex ? (
									<button onClick={() => handleSave(rowIndex)}>
										Сохранить
									</button>
								) : (
									<button onClick={() => handleEdit(rowIndex)}>
										Редактировать
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default DataSet
