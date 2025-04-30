import { Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../helpers/axios.instance';
import React from 'react';

const { Option } = Select;

const fetchSkills = async () => {
    const res = await axiosInstance.get('/skills');
    return res.data;
};

const SkillSelector = ({ selectedSkills, setSelectedSkills }:
    { selectedSkills: number[]; setSelectedSkills: React.Dispatch<React.SetStateAction<number[]>>; }) => {
    const { data: skills = [], isLoading, isError } = useQuery({
        queryKey: ['skills'],
        queryFn: fetchSkills,
    });

    return (
        <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={isLoading ? 'Loading skills...' : 'Select skills'}
            value={selectedSkills}
            onChange={(value) => {
                setSelectedSkills(value.map(val => Number(val)));
            }}
            loading={isLoading}
        >
            {!isError &&
                skills.map((skill: { id: number, name: string }) => (
                    <Option key={skill.id} value={skill.id}>
                        {skill.name}
                    </Option>
                ))}
        </Select>
    );
};

export default SkillSelector;
