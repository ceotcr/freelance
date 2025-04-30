import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput, LoginResponse } from '../schemas/login.schema';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Col, Row, message } from 'antd';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router';
import axiosInstance from '../helpers/axios.instance';

const Login: React.FC = () => {
    const authStore = useAuthStore()
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: async (data: LoginInput) => {
            const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
            return response.data;
        },
        onSuccess: (data: LoginResponse) => {
            authStore.setTokens(data.accessToken, data.refreshToken);
            authStore.setUser(data.user);
            message.success(`Welcome, ${data.user.firstName + ' ' + data.user.lastName}!`);
            if ((!data.user.bio || !data.user.profilePicture) && data.user.role === 'freelancer') {
                navigate("/complete-profile")
            }
            else {
                navigate('/dashboard')
            }
        },
        onError: () => {
            alert('Login failed.');
        },
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginInput) => {
        mutation.mutate(data);
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-bold mb-4">UpLance | Welcome Back!</h2>
            <Form.Item
                label="Username"
                validateStatus={errors.username ? 'error' : ''}
                help={errors.username?.message}
            >
                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Password"
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
            >
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => <Input.Password {...field} />}
                />
            </Form.Item>


            <Row gutter={16} className="mb-4">
                <Col span={24}>
                    <p className="text-sm text-gray-800">
                        Don't have an account yet?{' '}
                        <a href="/register" className="text-blue-500 hover:underline">
                            Register here
                        </a>
                    </p>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                    {mutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;
