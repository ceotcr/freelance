// src/components/RegisterForm.tsx
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../schemas/register.schema';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router';
import { Form, Input, Select, Button, Row, Col, message } from 'antd';
import axiosInstance from '../helpers/axios.instance';
import { useAuthStore } from '../store/auth.store';

const { Option } = Select;

const RegisterForm: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const authStore = useAuthStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (authStore.user) {
            if ((authStore.user.bio && authStore.user.profilePicture) || authStore.user.role !== "freelancer") {
                navigate('/dashboard')
            }
            else {
                navigate('/profile')
            }
        }
    }, [authStore.user])

    const mutation = useMutation({
        mutationFn: (data: RegisterInput) =>
            axiosInstance.post('/auth/register', data),
        onSuccess: () => {
            message.success('Registration successful!');
        },
        onError: (error) => {
            message.error(error.message)
        },
    });

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            role: (searchParams.get('as') as RegisterInput['role']) || 'client',
        },
    });

    const onSubmit = (data: RegisterInput) => {
        mutation.mutate(data);
    };

    useEffect(() => {
        setSearchParams({ as: watch('role') });
    }
        , [watch('role')]);

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className='max-lg:max-w-[512px] py-20 max-lg:mx-auto w-full'>
            <h2 className="text-2xl font-bold mb-4">UpLance | Register</h2>
            <Row gutter={16}>
                <Col sm={12} span={24}>
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
                </Col>
                <Col sm={12} span={24}>
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
                </Col>
            </Row>

            <Row gutter={16}>
                <Col sm={12} span={24}>
                    <Form.Item
                        label="Email"
                        validateStatus={errors.email ? 'error' : ''}
                        help={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                </Col>
                <Col sm={12} span={24}>
                    <Form.Item
                        label="Role"
                        validateStatus={errors.role ? 'error' : ''}
                        help={errors.role?.message}
                    >
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select {...field}>
                                    <Option value="client">Client</Option>
                                    <Option value="freelancer">Freelancer</Option>
                                </Select>
                            )}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col sm={12} span={24}>
                    <Form.Item
                        label="First Name"
                        validateStatus={errors.firstName ? 'error' : ''}
                        help={errors.firstName?.message}
                    >
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                </Col>
                <Col sm={12} span={24}>
                    <Form.Item
                        label="Last Name"
                        validateStatus={errors.lastName ? 'error' : ''}
                        help={errors.lastName?.message}
                    >
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16} className="mb-4">
                <Col span={24}>
                    <p className="text-sm text-gray-800">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-500 hover:underline">
                            Login
                        </a>
                    </p>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                    {mutation.isPending ? 'Registering...' : 'Register'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterForm;
