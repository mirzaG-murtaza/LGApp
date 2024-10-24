import React from "react";
import {
  CloseOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  Card,
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  notification,
  Row,
  Col,
} from "antd";
import { useDispatch } from "react-redux";
import { addLeads } from "../../features/data/Leads/addLeadsSlice";
import { motion, AnimatePresence } from "framer-motion";
import "../../index.css";

const { TextArea } = Input;

const AddLeads = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const statusOptions = [
    { value: "NEW", label: "New" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "REJECTED", label: "Rejected" },
    { value: "ABANDONED", label: "Abandoned" },
  ];

  const jobTypeOptions = [
    { value: "REMOTE", label: "Remote" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "ONSITE", label: "Onsite" },
  ];

  const callStatusOptions = [
    { value: "TAKEN", label: "Taken" },
    { value: "MISSED", label: "Missed" },
  ];

  const handleFinish = async (values) => {
    try {
      console.log("Form data:", values);
      await dispatch(addLeads(values)).unwrap();
      notification.success({
        message: "Success",
        description: "Lead added successfully!",
      });
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "There was an issue adding the lead.",
      });
    }
  };

  return (
    <div className="form-container">
      <Card
        title="Add New Lead"
        style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="custom-form"
          style={{ width: "100%" }}
        >
          {/* Lead Information */}
          <Card
            type="inner"
            title="Lead Information"
            style={{ marginBottom: "20px" }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="companyName"
                  label="Company Name"
                  rules={[
                    { required: true, message: "Please enter company name" },
                  ]}
                >
                  <Input placeholder="Company Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="companyEmail"
                  label="Company Email"
                  rules={[
                    { required: true, message: "Please enter company email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Company Email" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="inviterName"
                  label="Inviter Name"
                  rules={[
                    { required: true, message: "Please enter inviter name" },
                  ]}
                >
                  <Input placeholder="Inviter Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="techStackName"
                  label="Tech Stack"
                  rules={[
                    { required: true, message: "Please enter tech stack" },
                  ]}
                >
                  <Input placeholder="Tech Stack" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="bdName"
                  label="BD Name"
                  rules={[{ required: true, message: "Please enter BD name" }]}
                >
                  <Input placeholder="BD Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="devName"
                  label="Dev Name"
                  rules={[{ required: true, message: "Please enter dev name" }]}
                >
                  <Input placeholder="Developer Name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="coordinatorName"
                  label="Coordinator Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter coordinator name",
                    },
                  ]}
                >
                  <Input placeholder="Coordinator Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="coordinatorEmail"
                  label="Coordinator Email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter coordinator email",
                    },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Coordinator Email" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="profileName"
                  label="Profile Name"
                  rules={[
                    { required: true, message: "Please enter profile name" },
                  ]}
                >
                  <Input placeholder="Profile Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="profileEmail"
                  label="Profile Email"
                  rules={[
                    { required: true, message: "Please enter profile email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Profile Email" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="jobType"
                  label="Job Type"
                  rules={[
                    { required: true, message: "Please select job type" },
                  ]}
                >
                  <Select placeholder="Select Job Type">
                    {jobTypeOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Select placeholder="Select Status">
                    {statusOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea rows={4} placeholder="Enter description" />
            </Form.Item>
          </Card>

          {/* Call Schedules */}
          <Form.List name="callSchedules">
            {(fields, { add, remove }) => (
              <>
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <Card
                        key={field.key}
                        title={`Call Schedule ${index + 1}`}
                        style={{ marginBottom: "20px" }}
                        extra={
                          <Button
                            type="link"
                            icon={<CloseOutlined />}
                            onClick={() => remove(field.name)}
                            danger
                          >
                            Remove
                          </Button>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "devName"]}
                              label="Dev Name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter dev name",
                                },
                              ]}
                            >
                              <Input placeholder="Developer Name" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "coordinatorName"]}
                              label="Coordinator Name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter coordinator name",
                                },
                              ]}
                            >
                              <Input placeholder="Coordinator Name" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "coordinatorEmail"]}
                              label="Coordinator Email"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter coordinator email",
                                },
                                {
                                  type: "email",
                                  message: "Please enter a valid email",
                                },
                              ]}
                            >
                              <Input placeholder="Coordinator Email" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "leadCompanyName"]}
                              label="Lead Company Name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter lead company name",
                                },
                              ]}
                            >
                              <Input placeholder="Lead Company Name" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "leadCompanyEmail"]}
                              label="Lead Company Email"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter lead company email",
                                },
                                {
                                  type: "email",
                                  message: "Please enter a valid email",
                                },
                              ]}
                            >
                              <Input placeholder="Lead Company Email" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "notes"]}
                              label="Call Notes"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter call notes",
                                },
                              ]}
                            >
                              <TextArea rows={2} placeholder="Call Notes" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "callCategory"]}
                              label="Call Category"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select call category",
                                },
                              ]}
                            >
                              <Radio.Group>
                                <Radio value="hr">HR Round</Radio>
                                <Radio value="technical">Technical Round</Radio>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "callDate"]}
                              label="Call Date"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select call date",
                                },
                              ]}
                            >
                              <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          {...field}
                          name={[field.name, "callStatus"]}
                          label="Call Status"
                          rules={[
                            {
                              required: true,
                              message: "Please select call status",
                            },
                          ]}
                        >
                          <Select placeholder="Select Call Status">
                            {callStatusOptions.map((option) => (
                              <Select.Option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {/* Follow Ups */}
                        <Form.List name={[field.name, "followUps"]}>
                          {(
                            subFields,
                            { add: addFollowUp, remove: removeFollowUp }
                          ) => (
                            <>
                              <AnimatePresence>
                                {subFields.map((subField, subIndex) => (
                                  <motion.div
                                    key={subField.key}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: "hidden" }}
                                  >
                                    <Card
                                      type="inner"
                                      title={`Follow Up ${subIndex + 1}`}
                                      style={{ marginBottom: "20px" }}
                                      extra={
                                        <Button
                                          type="link"
                                          icon={<MinusCircleOutlined />}
                                          onClick={() =>
                                            removeFollowUp(subField.name)
                                          }
                                          danger
                                        >
                                          Remove
                                        </Button>
                                      }
                                    >
                                      <Row gutter={16}>
                                        <Col span={12}>
                                          <Form.Item
                                            {...subField}
                                            name={[
                                              subField.name,
                                              "followupDate",
                                            ]}
                                            label="Follow Up Date"
                                            rules={[
                                              {
                                                required: true,
                                                message: "Please select date",
                                              },
                                            ]}
                                          >
                                            <DatePicker
                                              style={{ width: "100%" }}
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                          <Form.Item
                                            {...subField}
                                            name={[subField.name, "callNotes"]}
                                            label="Follow Up Notes"
                                            rules={[
                                              {
                                                required: true,
                                                message: "Please enter notes",
                                              },
                                            ]}
                                          >
                                            <TextArea
                                              rows={2}
                                              placeholder="Notes"
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    </Card>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => addFollowUp()}
                                  block
                                  icon={<PlusOutlined />}
                                  className="addButtons"
                                >
                                  Add Follow Up
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    className="addButtons"
                  >
                    Add Call Schedule
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddLeads;
