import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import CompleteProfile from './pages/CompleteProfile'
import DashBoard from './pages/DashBoard'
import MainLayout from './layouts/MainLayout'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route element={<AuthLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Route>
            <Route element={<MainLayout />}>
                <Route path='/profile' element={<CompleteProfile />} />
                <Route path="/dashboard" element={<DashBoard />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes