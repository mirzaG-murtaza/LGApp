import React, { useEffect } from "react";
import {
  CloseOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Radio,
  Select,
  DatePicker,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateLead } from "../../features/data/Leads/updateLeadSlice";
import { refreshLeads } from "../../features/data/Leads/getLeadsSlice";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import "../../index.css";

const { TextArea } = Input;

const EditLeads = () => {
  const dispatch = useDispatch();
  const { data: leads, editable } = useSelector((state) => state.editLead);
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

  useEffect(() => {
    if (leads) {
      const initialValues = {
        ...leads,
        firstContactDate: leads.firstContactDate
          ? dayjs(leads.firstContactDate)
          : null,
        callSchedules: leads.callSchedules?.map((schedule) => ({
          ...schedule,
          callDate: schedule.callDate ? dayjs(schedule.callDate) : null,
          followUps: schedule.followUps?.map((followUp) => ({
            ...followUp,
            followupDate: followUp.followupDate
              ? dayjs(followUp.followupDate)
              : null,
          })),
        })),
      };

      form.setFieldsValue(initialValues);
    }
  }, [leads, form]);

  useEffect(() => {
    return () => {
      dispatch(refreshLeads());
    };
  }, [dispatch]);

  const handleSave = async () => {
    try {
      const updatedData = await form.validateFields();

      const leadId = leads.id || leads._id;

      if (!leadId) {
        throw new Error("Invalid lead ID");
      }

      const updatedDataWithUTC = {
        ...updatedData,
        callSchedules: updatedData.callSchedules?.map((schedule) => ({
          ...schedule,
          callDate: schedule.callDate
            ? schedule.callDate.toISOString()
            : null,
          followUps: schedule.followUps?.map((followUp) => ({
            ...followUp,
            followupDate: followUp.followupDate
              ? followUp.followupDate.toISOString()
              : null,
          })),
        })),
      };

      await dispatch(updateLead({ id: leadId, ...updatedDataWithUTC })).unwrap();

      notification.success({
        message: "Success",
        description: "Lead updated successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.message || "Failed to update the lead. Please try again.",
      });
      console.error("Validation failed:", error);
    }
  };

  return (
    <div className="form-container">
      {leads && (
        <Form
          form={form}
          layout="vertical"
          initialValues={form.getFieldsValue()}
          onFinish={handleSave}
          className="custom-form"
          style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
        >
          {/* Lead Information */}
          <Card title="Lead Information" style={{ marginBottom: "20px" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="companyName"
                  label="Company Name"
                  rules={[
                    { required: true, message: "Please enter company name" },
                  ]}
                >
                  <Input readOnly={!editable} />
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
                  <Input readOnly={!editable} />
                </Form.Item>
              </Col>
            </Row>
            {/* Additional Lead Information Fields */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="inviterName"
                  label="Inviter Name"
                  rules={[
                    { required: true, message: "Please enter inviter name" },
                  ]}
                >
                  <Input readOnly={!editable} />
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
                  <Input readOnly={!editable} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="bdName"
                  label="BD Name"
                  rules={[
                    { required: true, message: "Please enter BD name" },
                  ]}
                >
                  <Input readOnly={!editable} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="devName"
                  label="Dev Name"
                  rules={[
                    { required: true, message: "Please enter dev name" },
                  ]}
                >
                  <Input readOnly={!editable} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="coordinatorName"
                  label="Coordinator Name"
                  rules={[
                    { required: true, message: "Please enter coordinator name" },
                  ]}
                >
                  <Input readOnly={!editable} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="coordinatorEmail"
                  label="Coordinator Email"
                  rules={[
                    { required: true, message: "Please enter coordinator email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input readOnly={!editable} />
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
                  <Input readOnly={!editable} />
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
                  <Input readOnly={!editable} />
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
                  <Select
                    placeholder="Select Job Type"
                    disabled={!editable}
                  >
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
                  rules={[
                    { required: true, message: "Please select status" },
                  ]}
                >
                  <Select
                    placeholder="Select Status"
                    disabled={!editable}
                  >
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
              rules={[
                { required: true, message: "Please enter description" },
              ]}
            >
              <TextArea rows={4} readOnly={!editable} />
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
                          editable && (
                            <Button
                              type="link"
                              icon={<CloseOutlined />}
                              onClick={() => remove(field.name)}
                              danger
                            >
                              Remove
                            </Button>
                          )
                        }
                      >
                        <Row gutter={16}>
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
                              <DatePicker
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                                disabled={!editable}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "devName"]}
                              label="Dev Name"
                              rules={[
                                { required: true, message: "Please enter dev name" },
                              ]}
                            >
                              <Input readOnly={!editable} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
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
                              <Input readOnly={!editable} />
                            </Form.Item>
                          </Col>
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
                              <Input readOnly={!editable} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
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
                              <Input readOnly={!editable} />
                            </Form.Item>
                          </Col>
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
                              <Input readOnly={!editable} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          {...field}
                          name={[field.name, "notes"]}
                          label="Call Notes"
                          rules={[
                            { required: true, message: "Please enter call notes" },
                          ]}
                        >
                          <TextArea rows={2} readOnly={!editable} />
                        </Form.Item>
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
                              <Radio.Group disabled={!editable}>
                                <Radio value="hr">HR Round</Radio>
                                <Radio value="technical">Technical Round</Radio>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
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
                              <Select
                                placeholder="Select Call Status"
                                disabled={!editable}
                              >
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
                          </Col>
                        </Row>

                        {/* Follow Ups */}
                        <Form.List name={[field.name, "followUps"]}>
                          {(
                            subFields,
                            { add: addFollowUp, remove: removeFollowUp }
                          ) => (
                            <>
                              <AnimatePresence>
                                {subFields.map((subField, followIndex) => (
                                  <motion.div
                                    key={subField.key}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: "hidden" }}
                                  >
                                    <Card
                                      type="inner"
                                      title={`Follow Up ${followIndex + 1}`}
                                      style={{ marginBottom: "20px" }}
                                      extra={
                                        editable && (
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
                                        )
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
                                              format="YYYY-MM-DD"
                                              style={{ width: "100%" }}
                                              disabled={!editable}
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
                                              readOnly={!editable}
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    </Card>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                              {editable && (
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
                              )}
                            </>
                          )}
                        </Form.List>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {editable && (
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
                )}
              </>
            )}
          </Form.List>

          {leads && editable && (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
              >
                Update
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </div>
  );
};

export default EditLeads;