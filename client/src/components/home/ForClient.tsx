import React from 'react';
import { Row, Col, Button } from 'antd';
import ForClientImage from '../../assets/images/for-client.jpg';
const ForClient: React.FC = () => {
    return (
        <Row className="w-[96%] max-w-[1440px] max-md:flex-col-reverse">
            <Col
                xs={24}
                md={12}
                className="bg-[#12544F] text-white p-10 flex flex-col justify-center"
            >
                <p className="uppercase font-medium text-sm tracking-wide mb-2">
                    For talent
                </p>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                    Find talent
                    your way
                </h1>
                <p className="text-lg mb-6">
                    Work with the largest network of independent professionals and get things done—from quick turnarounds to big transformations.
                </p>

                <div className="space-y-4 mb-6">
                    <div className="border-t border-white pt-2">
                        Post a job & hire like a pro
                    </div>
                    <div className="border-t border-white pt-2">
                        Browse talent profiles
                    </div>
                    <div className="border-t border-white pt-2">
                        Get help with your project from start to finish
                    </div>
                </div>

                <Button
                    type="primary"
                    size="large"
                    className="bg-white text-blue-600 font-semibold hover:bg-gray-100"
                >
                    Find talent
                </Button>
            </Col>
            <Col
                xs={24}
                md={12}
            >
                <img src={ForClientImage} alt="Work from home" className="w-full h-full object-cover" />
            </Col>
        </Row>
    );
};

export default ForClient;
