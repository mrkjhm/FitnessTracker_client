import React from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';


export default function Profile() {
    return (
        <>

            <div>profile</div>
            {/* Avatar Box */}
            {/*<div>*/}


            {/*    <div className="d-flex justify-content-center mb-4">*/}
            {/*        <div*/}
            {/*            style={{*/}
            {/*                width: 120,*/}
            {/*                height: 120,*/}
            {/*                backgroundColor: '#ddd',*/}
            {/*                borderRadius: '10px'*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </div>*/}

            {/*    /!* Form *!/*/}
            {/*    <Row className="justify-content-center">*/}
            {/*        <Col md={4}>*/}
            {/*            /!* Username *!/*/}
            {/*            <div className="input-group mb-3">*/}
            {/*                <span className="input-group-text"><FaUser /></span>*/}
            {/*                <Form.Control*/}
            {/*                    placeholder="Username"*/}
            {/*                    value={formData.userName}*/}
            {/*                    onChange={handleChange('userName')}*/}
            {/*                />*/}
            {/*            </div>*/}

            {/*            /!* Mobile No *!/*/}
            {/*            <div className="input-group mb-3">*/}
            {/*                <span className="input-group-text"><FaPhone /></span>*/}
            {/*                <Form.Control*/}
            {/*                    placeholder="Mobile No"*/}
            {/*                    value={formData.mobileNo}*/}
            {/*                    onChange={handleChange('mobileNo')}*/}
            {/*                />*/}
            {/*            </div>*/}

            {/*            /!* Email *!/*/}
            {/*            <div className="input-group mb-3">*/}
            {/*                <span className="input-group-text"><FaEnvelope /></span>*/}
            {/*                <Form.Control*/}
            {/*                    placeholder="Email"*/}
            {/*                    type="email"*/}
            {/*                    value={formData.email}*/}
            {/*                    onChange={handleChange('email')}*/}
            {/*                />*/}
            {/*            </div>*/}

            {/*            /!* Info textarea *!/*/}
            {/*            <Form.Group className="mb-3">*/}
            {/*                <Form.Control*/}
            {/*                    as="textarea"*/}
            {/*                    rows={3}*/}
            {/*                    placeholder="Info"*/}
            {/*                    value={formData.info}*/}
            {/*                    onChange={handleChange('info')}*/}
            {/*                    style={{ borderRadius: '15px' }}*/}
            {/*                />*/}
            {/*            </Form.Group>*/}

            {/*            /!* Submit Button *!/*/}
            {/*            <div className="d-grid">*/}
            {/*                <Button variant="outline-dark">Update</Button>*/}
            {/*            </div>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*</div>*/}
        </>


    )
}
