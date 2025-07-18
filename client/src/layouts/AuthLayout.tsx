import { Outlet, useSearchParams, useLocation, useNavigate } from "react-router"
import ClientImage from "../assets/images/for-client.jpg"
import TalentImage from "../assets/images/for-talent.jpg"
import LoginImage from "../assets/images/login.jpg"
import { useAuthStore } from "../store/auth.store"
import { useEffect } from "react"
const AuthLayout = () => {
    const { user } = useAuthStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (user) {
            if ((user.bio && user.profilePicture) || user.role !== "freelancer") {
                navigate('/dashboard')
            }
            else {
                navigate('/profile')
            }
        }
    }, [user])
    const [searchParams] = useSearchParams()
    const as = searchParams.get("as")
    const location = useLocation()
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
            <div className="grid grid-cols-2 max-lg:grid-cols-1 w-[96%] max-w-[1440px] gap-4 min-h-screen h-full items-center justify-center">
                <img src={location.pathname === "/login" ? LoginImage : as === "client" ? ClientImage : TalentImage} alt="" className="max-lg:hidden" />
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout