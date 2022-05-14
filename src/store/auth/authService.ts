import axios from 'axios';

const API_URL = 'https://still-earth-24890.herokuapp.com';
// const API_URL = 'https://localhost:4000';

// Register user
const signup = async (userData: { name: string, login: string, password: string }) => {
  const response = await axios.post(`${API_URL}/signup`, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Login user
const signin = async (userData: { login: string, password: string }) => {
  const response = await axios.post(`${API_URL}/signin`, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  signup,
  signin,
  logout,
}

export default authService;