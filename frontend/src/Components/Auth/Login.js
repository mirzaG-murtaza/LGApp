// Login.js
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Card, Spin, Alert, Row, Col } from "antd";
import { login } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import AnimatedEye from "./AnimatedEye";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { status, error } = useSelector((state) => state.auth);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [shake, setShake] = useState(false);
  const [animatePassword, setAnimatePassword] = useState(false);

  const onFinish = (credentials) => {
    dispatch(login(credentials));
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
    if (status === "failed") {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  }, [token, navigate, status]);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 100;
    const y = (clientY / innerHeight) * 100;
    document.documentElement.style.setProperty("--mouse-x", `${x}%`);
    document.documentElement.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const togglePasswordVisibility = () => {
    setAnimatePassword(true);
    setPasswordVisible((prevState) => !prevState);
    setTimeout(() => setAnimatePassword(false), 300); // Match with CSS transition duration
  };

  return (
    <div className="login-background">
      <Row justify="center" align="middle" className="login-row">
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card title="Login" className={`login-card ${shake ? "shake" : ""}`}>
            <Form
              name="loginForm"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
            >
              {/* Username Field */}
              <Form.Item
                label="Username"
                name="username"
                validateStatus={status === "failed" ? "error" : ""}
                help={status === "failed" ? error : ""}
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <div className="password-input-wrapper">
                <Input placeholder="Enter your username" className="username-input"/>
                </div>
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label="Password"
                name="password"
                validateStatus={status === "failed" ? "error" : ""}
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <div className="password-input-wrapper">
                  <Input
                    placeholder="Enter your password"
                    type={passwordVisible ? "text" : "password"}
                    className={`password-input ${
                      animatePassword ? "hidden" : "visible"
                    }`}
                  />
                  <button
                    type="button"
                    className="password-toggle-button"
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                  >
                    <AnimatedEye visible={passwordVisible} />
                  </button>
                </div>
              </Form.Item>

              {/* Loading Spinner */}
              {status === "loading" && (
                <div className="spin-container">
                  <Spin size="large" />
                </div>
              )}

              {/* Error Alert */}
              {status === "failed" && (
                <Alert
                  message="Login Failed"
                  description={error}
                  type="error"
                  showIcon
                  className="alert-message"
                />
              )}

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={status === "loading"}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
