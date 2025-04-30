import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import CompleteProfile from './pages/CompleteProfile'
import DashBoard from './pages/DashBoard'
import MainLayout from './layouts/MainLayout'
import CreateProjectPage from './pages/projects/CreateProject'
import EditProjectPage from './pages/projects/EditProject'
import ProjectDetailsPage from './pages/projects/ProjectDetails'
import ProjectsPage from './pages/projects/Projects'
import ClientAuthLayout from './layouts/ClientAuthLayout'
import CreateMilestonePage from './pages/milestones/CreateMilestone'
import EditMilestonePage from './pages/milestones/EditMilestone'
import FLAuthLayout from './layouts/FLAuthLayout'
import CreateBidPage from './pages/bids/CreateBids'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route element={<AuthLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Route>
            <Route element={<MainLayout />}>
                <Route element={<ClientAuthLayout />}>
                    <Route path="/projects/:id/edit" element={<EditProjectPage />} />
                    <Route path="/projects/create" element={<CreateProjectPage />} />
                    <Route path="/projects/:id/milestones/create" element={<CreateMilestonePage />} />
                    <Route path="/milestones/:milestoneId/edit" element={<EditMilestonePage />} />
                </Route>
                <Route element={<FLAuthLayout />}>
                    <Route path='projects/:projectId/bid' element={<CreateBidPage />} />
                </Route>
                <Route path='/profile' element={<CompleteProfile />} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            </Route>

        </Routes>
    )
}

export default AppRoutes