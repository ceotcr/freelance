import Features from "../components/home/Features"
import ForClient from "../components/home/ForClient"
import ForTalent from "../components/home/ForTalent"
import Hero from "../components/home/Hero"

const Home = () => {
    return (
        <div className="w-full flex flex-col h-full items-center justify-center lg:gap-20 md:gap-12 gap-8">
            <Hero />
            <Features />
            <ForClient />
            <ForTalent />
        </div>
    )
}

export default Home