import BgImage from "../../assets/images/hero-bg.jpg";

import { NavLink } from 'react-router'

const Hero = () => {
    return (
        <div className="w-[96%] max-w-[1440px] flex py-12 min-h-[400px] p-4 my-4 rounded-3xl bg-cover bg-no-repeat bg-center"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${BgImage})`
            }}
        >
            <div className="w-[75%]">
                <h1 className="text-7xl max-md:text-5xl text-white font-bold">
                    UpLance <br />
                    <span className="text-6xl max-md:text-4xl font-normal text-gray-100">
                        Connecting clients in need with
                        freelancers who deliver
                    </span>
                </h1>
                <p className="text-2xl max-md:text-xl mt-4 text-gray-100">
                    Find the perfect freelancer for your project, or showcase your skills and get hired.
                </p>
                <br />
                <span>
                    Register as
                </span>

                <div className="flex mt-8 gap-4">
                    <NavLink to="/register?as=freelancer" className="bg-black hover:text-black text-white px-6 py-3 rounded-4xl hover:bg-white transition duration-300">
                        Freelancer
                    </NavLink>

                    <NavLink to="/register?as=client" className="ring hover:ring-0 px-6 py-3 rounded-4xl hover:bg-white hover:text-black text-white transition duration-300">
                        Client
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Hero