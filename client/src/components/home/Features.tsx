import FeaturesImage from '../../assets/images/features.jpg'
import { MdEdit } from 'react-icons/md'
import { RiPushpinFill } from 'react-icons/ri'
import { FaRupeeSign } from "react-icons/fa";
const Features = () => {
    return (
        <div className="flex flex-col items-center justify-center w-[96%] max-w-[1440px] h-full">
            <div className="grid grid-cols-2 max-lg:grid-cols-1 items-center justify-center w-full gap-4 rounded-3xl">
                <img src={FeaturesImage} alt="Features" className="w-full max-lg:max-h-[240px] rounded-3xl h-full object-cover object-center" />
                <div className="flex flex-col gap-6 p-4">
                    <h1 className="text-5xl max-md:text-4xl font-medium">Up your freelance game,
                        It&apos;s easy</h1>
                    <ul className="list-none list-inside text-xl max-md:text-lg flex flex-col text-gray-900 gap-4">
                        <li className='flex gap-4'>
                            <MdEdit size={32} />
                            <div>
                                <h4 className="text-xl font-medium">No cost to join</h4>
                                <p className="text-lg text-gray-800">
                                    Register and browse talent profiles, explore projects, or even book a consultation.
                                </p>
                            </div>
                        </li>
                        <li className='flex gap-4'>
                            <RiPushpinFill size={32} />
                            <div>
                                <h4 className="text-xl font-medium">Post a job and hire top talent</h4>
                                <p className="text-lg text-gray-800">
                                    Finding talent doesn&apos;t have to be a chore. Post a job or we can search for you!
                                </p>
                            </div>
                        </li>
                        <li className='flex gap-4'>
                            <FaRupeeSign size={32} />
                            <div>
                                <h4 className="text-xl font-medium">Work with the best—without breaking the bank</h4>
                                <p className="text-lg text-gray-800">
                                    Upwork makes it affordable to up your work and take advantage of low transaction rates.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Features