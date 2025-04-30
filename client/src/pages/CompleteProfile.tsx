import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeProfileSchema, CompleteProfileInput } from '../schemas/completeProfile.schema';
import { useAuthStore } from '../store/auth.store';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import axiosInstance from '../helpers/axios.instance';
import { useNavigate } from 'react-router';
import { SERVER_URL } from '../helpers/constants';
import SkillSelector from '../components/freelancer/SkillSelector';
import ProfieImage from '../assets/images/profile.jpg'

const CompleteProfile: React.FC = () => {
    const { user, setUser } = useAuthStore();
    const [previewImage, setPreviewImage] = useState<string | undefined>(SERVER_URL + user?.profilePicture);
    const [selectedSkills, setSelectedSkills] = useState<number[]>(user?.skills.map(skill => skill.id) || []);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CompleteProfileInput>({
        resolver: zodResolver(completeProfileSchema),
        defaultValues: {
            bio: user?.bio || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (data: CompleteProfileInput) => {
            if (!user) throw new Error('User not found');
            const formData = new FormData();
            if (!user.profilePicture) {
                if (!data.profilePicture) {
                    message.error('Please upload a profile picture.');
                    throw new Error('Profile picture is required');
                }
            }
            if (data.profilePicture) {
                formData.append('profilePicture', data.profilePicture);
            }
            formData.append('bio', data.bio);
            formData.append('skills', JSON.stringify(selectedSkills));
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            const response = await axiosInstance.post(`/users/${user.id}/complete-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        },
        onSuccess: (data) => {
            message.success('Profile updated successfully!');
            setUser({ ...user, ...data });
            navigate('/dashboard');
        },
        onError: () => {
            message.error('Failed to update profile.');
        },
    });

    const onSubmit = (data: CompleteProfileInput) => {
        mutation.mutate(data);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('profilePicture', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='w-full min-h-screen  bg-white'>
            <div className='grid grid-cols-2 max-lg:grid-cols-1 w-[96%] max-w-[1440px] mx-auto'>
                <img src={ProfieImage} alt="" className='lg:sticky max-lg:hidden mx-auto lg:top-20 object contain max-h-[calc(100vh-10rem)]' />
                <div style={{ maxWidth: "100%", margin: '40px auto', padding: '24px' }}>
                    <h2 className="text-3xl font-bold mb-4">UpLance</h2>
                    <h2 className='text-xl'>Complete Your Profile</h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        For better experience upload a
                        <span style={{ fontWeight: 'bold' }}> profile picture</span> and add a short <span style={{ fontWeight: 'bold' }}>bio</span> about yourself.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* firstName & lastName */}
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="firstName" style={{ display: 'block', marginBottom: 8 }}>First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                className='w-full h-10 border border-gray-300 rounded-md p-2'
                                {...register('firstName')}
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && <p style={{ color: 'red', marginTop: 4 }}>{errors.firstName.message}</p>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="lastName" style={{ display: 'block', marginBottom: 8 }}>Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                className='w-full h-10 border border-gray-300 rounded-md p-2'
                                {...register('lastName')}
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && <p style={{ color: 'red', marginTop: 4 }}>{errors.lastName.message}</p>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="profilePicture" style={{ display: 'block', marginBottom: 8 }}>Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className='cursor-pointer w-full h-10 border border-gray-300 rounded-md p-2'
                            />
                            {errors.profilePicture && (
                                <p style={{ color: 'red', marginTop: 4 }}>{errors.profilePicture.message}</p>
                            )}
                            {previewImage && (
                                <div style={{ marginTop: 12 }}>
                                    <img src={previewImage} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="bio" style={{ display: 'block', marginBottom: 8 }}>Bio</label>
                            <textarea
                                id="bio"
                                className='w-full h-24 border border-gray-300 rounded-md p-2'
                                {...register('bio')}
                                rows={4}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', borderColor: '#ccc' }}
                                placeholder="Tell us something about yourself..."
                            />
                            {errors.bio && <p style={{ color: 'red', marginTop: 4 }}>{errors.bio.message}</p>}
                        </div>
                        <SkillSelector selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className={`w-full h-10 my-4 bg-blue-500 text-white rounded-md ${mutation.isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;
