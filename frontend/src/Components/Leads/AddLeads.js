import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Card,
  Space,
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import "../../index.css";
import { addLeads } from "../../features/data/Leads/addLeadsSlice";

const { TextArea } = Input;

const AddLeads = () => {
  const dispatch = useDispatch();
  const { status: addLeadsStatus, error: addLeadsError } = useSelector((state) => state.addLeads);
  const [form] = Form.useForm();

  const status = {
    NEW: "New",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CLOSED: "Closed",
  };

  const statusOptions = Object.entries(status).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const handleFinish = (values) => {
    console.log("Form data:", values);
    dispatch(addLeads(values))
      .unwrap()
      .then(() => {
        if (addLeadsStatus === "succeeded") {
          notification.success({
            message: "Success",
            description: "Lead added successfully!",
          });
          form.resetFields();
        } else if (addLeadsStatus === "failed") {
          notification.error({
            message: "Error",
            description: addLeadsError || "There was an issue adding the lead.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: addLeadsError || "There was an issue adding the lead.",
        });
      });
  };
  

  return (
    <div className="form-container">
      <Form
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Form.Item
          name="companyName"
          rules={[{ required: true, message: "Please input!" }]}
          label="Company Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="inviterName"
          rules={[{ required: true, message: "Please input!" }]}
          label="Inviter Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="techStackName"
          rules={[{ required: true, message: "Please input!" }]}
          label="Tech Stack"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="bdName"
          rules={[{ required: true, message: "Please input!" }]}
          label="BD Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="devName"
          rules={[{ required: true, message: "Please input!" }]}
          label="Dev Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coordinatorName"
          rules={[{ required: true, message: "Please input!" }]}
          label="Coordinator Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="profileName"
          rules={[{ required: true, message: "Please input!" }]}
          label="Profile Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select placeholder="Select a status">
            {statusOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: "Please input!" }]}
          label="Description"
        >
          <TextArea rows={6} />
        </Form.Item>
        <Form.List name="callSchedules">
          {(fields, { add, remove }) => (
            <div
              style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Call Schedule ${field.name + 1}`}
                  key={field.key}
                  extra={<CloseOutlined onClick={() => remove(field.name)} />}
                >
                  <Form.Item
                    rules={[{ required: true, message: "Please input!" }]}
                    label="Dev Name"
                    name={[field.name, "devName"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true, message: "Please input!" }]}
                    label="Coordinator Name"
                    name={[field.name, "coordinatorName"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true, message: "Please input!" }]}
                    label="Lead Company Name"
                    name={[field.name, "leadCompanyName"]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    rules={[{ required: true, message: "Please input!" }]}
                    label="Call Notes"
                    name={[field.name, "notes"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "callCategory"]}
                    rules={[{ required: true, message: "Please select!" }]}
                  >
                    <Radio.Group>
                      <Radio value="hr"> HR Round </Radio>
                      <Radio value="technical"> Technical Round </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name={[field.name, "callDate"]}>
                    <DatePicker />
                  </Form.Item>

                  <Form.List name={[field.name, "followUps"]}>
                    {(
                      subFields,
                      { add: addFollowUp, remove: removeFollowUp }
                    ) => (
                      <div className="followUpsContainer">
                        {subFields.map((subField) => (
                          <Space key={subField.key}>
                            <Form.Item
                              name={[
                                subField.name,
                                "followupDate",
                              ]}
                            >
                              <DatePicker />
                            </Form.Item>
                            <Form.Item
                              name={[
                                subField.name,
                                "callNotes",
                              ]}
                            >
                              <Input placeholder="Follow Up Notes" />
                            </Form.Item>
                            <Form.Item
                              name={[
                                subField.name,
                                "status",
                              ]}
                              label="Status"
                            >
                              <Select placeholder="Select a status">
                                {statusOptions.map((option) => (
                                  <Select.Option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <Button
                              type="primary"
                              danger
                              onClick={() => removeFollowUp(subField.name)}
                            >
                              Remove Follow Up
                            </Button>
                          </Space>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => addFollowUp()}
                          block
                          style={{ borderColor: "green", color: "green" }}
                        >
                          Add Follow Up
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                style={{ borderColor: "green", color: "green" }}
              >
                Add Call Schedule
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddLeads;
