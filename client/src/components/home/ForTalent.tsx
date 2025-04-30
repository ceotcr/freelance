import React from 'react';
import { Row, Col, Button } from 'antd';
import ForTalentImage from '../../assets/images/for-talent.jpg';
const ForTalent: React.FC = () => {
    return (
        <Row className="w-[96%] max-w-[1440px]">
            <Col
                xs={24}
                md={12}
            >
                <img src={ForTalentImage} alt="Work from home" className="w-full h-full object-cover" />
            </Col>

            <Col
                xs={24}
                md={12}
                className="bg-blue-600 text-white p-10 flex flex-col justify-center"
            >
                <p className="uppercase font-medium text-sm tracking-wide mb-2">
                    For talent
                </p>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                    Find great work
                </h1>
                <p className="text-lg mb-6">
                    Meet clients you&apos;re excited to work with and take your career or business to new heights.
                </p>

                <div className="space-y-4 mb-6">
                    <div className="border-t border-white pt-2">
                        Find opportunities for every stage of your freelance career
                    </div>
                    <div className="border-t border-white pt-2">
                        Control when, where, and how you work
                    </div>
                    <div className="border-t border-white pt-2">
                        Explore different ways to earn
                    </div>
                </div>

                <Button
                    type="primary"
                    size="large"
                    className="bg-white text-blue-600 font-semibold hover:bg-gray-100"
                >
                    Find opportunities
                </Button>
            </Col>
        </Row>
    );
};

export default ForTalent;
