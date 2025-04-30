import CDashboard from "../components/client/CDashboard"
import FDashboard from "../components/freelancer/FDashboard"
import { useAuthStore } from "../store/auth.store"

const DashBoard = () => {
    const { user } = useAuthStore()
    if (!user)
        return "unauthorized"
    if (user.role == "client")
        return <CDashboard />

    else if (user.role == "freelancer") return <FDashboard />
    else return "role undefined"
}

export default DashBoard