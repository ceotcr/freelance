import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import CompleteProfile from './pages/CompleteProfile'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route element={<AuthLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Route>
            <Route path='/complete-profile' element={<CompleteProfile />} />
        </Routes>
    )
}

export default AppRoutes