import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store';
import { reset, logout } from '../store/auth/authSlice';

type Props = {}

const Header = (props: Props) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user } = useSelector((state: any) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='header w-full flex justify-between items-center px-6 py-6 border-b-2 border-b-slate-100'>
      <div className="logo">
        <Link to='/' className='text-2xl font-semibold'>Dashboard</Link>
      </div>
      <div className='nav__list flex justify-between gap-x-6'>
        {user ? (
          <>
            <button onClick={onLogout} className="nav__item px-4 py-2 whitespace-nowrap inline-flex items-center justify-center text-lg border-transparent rounded-md shadow-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200">
              Logout
            </button>
            <div className="nav__user w-full flex flex-row justify-center items-center gap-2">
              <img src="../assets/images/sample-avatar.jpg" alt="user avatar"
                className='w-full h-6' 
              />
              <span>{user.login}</span>
            </div>
          </>
        ) : (
          <>
            <Link to='/signin' className="nav__item px-4 py-2 whitespace-nowrap flex items-center justify-center text-lg">
              Sign In
            </Link>
            <Link to='/signup' className="nav__item px-4 py-2 whitespace-nowrap inline-flex items-center justify-center text-lg border-transparent rounded-md shadow-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header;