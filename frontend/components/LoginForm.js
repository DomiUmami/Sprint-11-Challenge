import React, { useState } from 'react'
import PT from 'prop-types'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm(props) {
  props.login
  const [values, setValues] = useState(initialFormValues)
  const navigate = useNavigate()
  const [error, setError] = useState('')



  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = async (evt) => {
    evt.preventDefault()
    setError('')
    try{
      const { data } = await axios.post(
        'http://localhost:9000/api/login',
          { ...values }
      )
      localStorage.setItem('token', data.token)
      navigate('/articles')
    } catch (err){
      setError(
      err?.response?.data?.message || 
      console.log("Set up the Axios Error or hardcoded error")
      )
    }
  }

  const isDisabled = () => {
    return values.username.trim().length < 3 || values.password.trim().length < 8;
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
