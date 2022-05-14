import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signin, reset } from '../store/auth/authSlice';
import Spinner from '../components/Spinner';

type Props = {}

const SigninPage = (props: Props) => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  })

  const { login, password } = formData;

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user, isLoading, isSuccess, isError, message } = useSelector((state: any) => state.auth)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }
    if(isSuccess || user) {
      navigate('/')
    }
    dispatch(reset())
  }, [user, isLoading, isSuccess, isError, message, navigate, dispatch,])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userData = {
      login, 
      password
    }
    dispatch(signin(userData))
  }

  if(isLoading) {
    return <Spinner />
  }

  return (
    <section className='signin-page w-full px-6 py-6 flex flex-col justify-center items-center gap-16'>
      <div className="logo__container w-full flex flex-col justify-center items-center gap-3">
        <h1 className="logo">Some Logo</h1>
        <p className="title text-center font-bold text-3xl text-gray-900">Sign in to your account</p>
      </div>
      <form onSubmit={onSubmit} className="form w-1/4 flex flex-col justify-center items-center gap-6">
        <div className="form__item w-full">
          <input type="text" id='login' name='login' value={login} placeholder='Enter your login' onChange={onChange} required
            className="form__control inline-flex w-full items-center px-4 py-3 border border-solid border-slate-400 rounded-lg" 
          />
        </div>
        <div className="form__item w-full">
          <input type="password" id='password' name='password' value={password} placeholder='Enter your password' onChange={onChange} required
            className="form__control inline-flex w-full items-center px-4 py-3 border border-solid border-slate-400 rounded-lg" 
          />
        </div>
        <div className="form__item w-full flex justify-center">
          <button type='submit' className='form__button w-full px-4 py-2 text-lg border-transparent rounded-md shadow-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200'>Sign in</button>  
        </div>
      </form>
      <div className="have-account w-full flex justify-center items-center">
        <span>Don’t have an account?&nbsp;</span><Link to='/signup' className='text-indigo-600 hover:text-indigo-700 transition-all duration-200'>Sign Up</Link>
      </div>
    </section>
  )
}

export default SigninPage;