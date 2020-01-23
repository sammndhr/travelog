import axios from 'axios'

const authHeader = () => {
  let user = JSON.parse(localStorage.getItem('user'))

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token }
  } else {
    return {}
  }
}

const _login = async (username, password) => {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }

  try {
    const res = await axios.post(`/users/authenticate`, requestOptions),
      data = handleResponse(res),
      user = JSON.parse(data.user)
    if (user.token) {
      localStorage.setItem('user', JSON.stringify(user))
    }
    return user
  } catch (error) {
    console.error(error)
  }
}

const _logout = () => {
  localStorage.removeItem('user')
}

const _register = async user => {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }
  try {
    const res = await axios.post(`/users/register`, requestOptions)
    return handleResponse(res)
  } catch (error) {
    console.error(error)
  }
}

const _update = async user => {
  const requestOptions = {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }
  try {
    const res = await axios.put(`/users/${user.id}`, requestOptions)
    return handleResponse(res)
  } catch (error) {
    console.error(error)
  }
}

const _delete = async id => {
  const requestOptions = {
    headers: authHeader()
  }

  try {
    const res = await axios.delete(`/users/${id}`, requestOptions)
    return handleResponse(res)
  } catch (error) {
    console.error(error)
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

export { _login, _logout, _register, _update, _delete }
