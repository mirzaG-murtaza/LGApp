import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Card, Spin, Alert, Row, Col } from "antd";
import { login } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const cardStyle = {
  boxShadow: "0 4px 8px rgba(0, 123, 255, 0.6)",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { status, error } = useSelector((state) => state.auth);

  const onFinish = (credentials) => {
    dispatch(login(credentials));
  };

  useEffect(() => {
    console.log("Token:", token);
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <Row justify="center" style={{ marginTop: 100 }}>
      <Col xs={24} sm={24} md={12} lg={8} xl={6}>
        <Card title="Login" style={cardStyle}>
          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {status === "loading" && <Spin size="large" style={{ margin: '16px 0' }} />}

            {status === "failed" && (
              <Alert
                message="Login Failed"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={status === "loading"}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
