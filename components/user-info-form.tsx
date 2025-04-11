import React, { useState } from 'react';

interface UserInfo {
    province: string;
    grade: string;
}

interface UserInfoFormProps {
    onSubmit: (userInfo: string) => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        province: '',
        grade: '',
    });

    const provinces = [
        '北京',
        '上海',
        '广东',
        '江苏',
        '浙江',
        '山东',
        '河北',
        '河南',
        '湖北',
        '湖南',
        '安徽',
        '福建',
        '四川',
        '重庆',
        '陕西',
        '辽宁',
        '吉林',
        '黑龙江',
    ];

    const grades = [
        '一年级',
        '二年级',
        '三年级',
        '四年级',
        '五年级',
        '六年级',
        '初一',
        '初二',
        '初三',
        '高一',
        '高二',
        '高三',
    ];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('User Information:', userInfo);
        onSubmit(JSON.stringify(userInfo));
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">用户信息表单</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="province" className="block mb-2 font-medium">
                        省份
                    </label>
                    <select
                        id="province"
                        name="province"
                        value={userInfo.province}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="" disabled>
                            选择省份
                        </option>
                        {provinces.map((province) => (
                            <option key={province} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="grade" className="block mb-2 font-medium">
                        年级
                    </label>
                    <select
                        id="grade"
                        name="grade"
                        value={userInfo.grade}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="" disabled>
                            选择年级
                        </option>
                        {grades.map((grade) => (
                            <option key={grade} value={grade}>
                                {grade}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    提交
                </button>
            </form>
        </div>
    );
};

export default UserInfoForm;
