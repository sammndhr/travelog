import axios from 'axios'

const authHeader = () => {
	let user = JSON.parse(localStorage.getItem('user'))

	if (user && user.token) {
		return { Authorization: 'Bearer ' + user.token }
	} else {
		return {}
	}
}

const _logout = () => {
	localStorage.removeItem('user')
}

const _update = async user => {
	const options = {
		method: 'PUT',
		headers: { ...authHeader(), 'Content-Type': 'application/json' },
		data: user,
		url: `/users/${user.id}`
	}
	let res
	try {
		res = await axios(options)
		return handleResponse(res)
	} catch (error) {
		return `${error.response.status}: ${error.response.data.message}`
	}
}

const _delete = async id => {
	const options = {
		method: 'DELETE',
		headers: authHeader(),
		url: `/users/${id}`
	}
	let res
	try {
		res = await axios(options)
		return handleResponse(res)
	} catch (error) {
		return `${error.response.status}: ${error.response.data.message}`
	}
}

const handleResponse = response => {
	const data = response.data
	if (!data && !data.success) {
		if (response.status === 401) {
			_logout()
			location.reload(true)
		}
	}
	return data
}

export { _logout, _update, _delete, handleResponse }
