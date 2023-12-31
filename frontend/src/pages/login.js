import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Form, Button, Input, notification, Image } from "antd";
import { handleLogin } from "../apis/auth";
import logo from "../assets/images/logo.png";
import { useAuthContext } from "../auth/auth-context";

export function LoginPage() {
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { setIsAuthenticated } = useAuthContext();


    const onFinish = (values) => {
        setIsLoading(true);
        const email = values.username;
        const password = values.password;

        handleLogin(email, password)
            .then((response) => {
                setIsAuthenticated(true);
                showSuccessNotification();
                navigate(`/home/flights`);
            })
            .catch((error) => {
                setIsAuthenticated(false);
                console.error(error);
                showFailedNotification(error);
            }).finally(() => {
                setIsLoading(false);
            });
    };

    const showSuccessNotification = () => {
        notification["success"]({
            message: "Login Successful! Welcome Back.",
        });
    };

    const showFailedNotification = (error) => {
        if (error?.response?.status === 401) {
            notification["error"]({
                message: "Login Failed. Please try again.",
                description: "Invalid username or password",
            });
            return;
        }

        if (error?.response?.status === 500) {
            notification["error"]({
                message: "Login Failed. Please try again.",
                description: "Internal server error",
            });
            return;
        }

        if (error?.response?.status === 400) {
            notification["error"]({
                message: "Login Failed. Please try again.",
                description: "Invalid request",
            });
            return;
        }

        notification["error"]({
            message: "Login Failed. Please try again.",
        });
    };

    return (
        <Row className="login-page-container">
            <Col span={16} offset={4}>
                <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Row>
                        <Col span={12} className="login-page-splash"></Col>
                        <Col span={12} className="login-page-form">
                            <Image
                                className="mt-9"
                                preview={false}
                                width={150}
                                src={logo}
                            />
                            <h1>Welcome to FlightBooker</h1>
                            <Row justify="center">
                                <Form
                                    layout="vertical"
                                    size="large"
                                    className="login-form"
                                    form={form}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        label="Username"
                                        name="username"
                                        rules={[
                                            { required: true },
                                            { type: "string" },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[
                                            { required: true },
                                            { type: "string" },
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            className="login-btn"
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            loading={isLoading}
                                        >
                                            Log In
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
}
