// src/components/CompleteProfile.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeProfileSchema, CompleteProfileInput } from '../schemas/completeProfile.schema';
import { useAuthStore } from '../store/auth.store';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';
import axiosInstance from '../helpers/axios.instance';

const CompleteProfile: React.FC = () => {
    const { user, updateProfile } = useAuthStore();
    const [previewImage, setPreviewImage] = useState<string | undefined>(user?.profilePicture);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CompleteProfileInput>({
        resolver: zodResolver(completeProfileSchema),
        defaultValues: {
            bio: user?.bio || '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: CompleteProfileInput) => {
            if (!user) throw new Error('User not found');
            const formData = new FormData();
            formData.append('profilePicture', data.profilePicture);
            formData.append('bio', data.bio);

            const response = await axiosInstance.post(`/users/${user.id}/complete-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            return response.data;
        },
        onSuccess: (data) => {
            updateProfile({
                profilePicture: data.profilePicture,
                bio: data.bio,
            });
            message.success('Profile updated successfully!');
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {errors.profilePicture && (
                    <p style={{ color: 'red' }}>{errors.profilePicture.message}</p>
                )}
                {previewImage && (
                    <div style={{ marginTop: 16 }}>
                        <img src={previewImage} alt="Preview" width={100} height={100} />
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    {...register('bio')}
                    rows={4}
                />
                {errors.bio && <p style={{ color: 'red' }}>{errors.bio.message}</p>}
            </div>

            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    );
};

export default CompleteProfile;
