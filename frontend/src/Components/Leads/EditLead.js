import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  Space,
  notification,
} from "antd";
import { refreshLeads } from "../../features/data/Leads/getLeadsSlice";
import { updateLead } from "../../features/data/Leads/updateLeadSlice";

const callScheduleStyle = {
  boxShadow: "0 4px 8px rgba(0, 123, 255, 0.6)",
  borderColor: "#007bff",
};

const followUpStyle = {
  boxShadow: "0 4px 8px rgba(40, 167, 69, 0.6)",
  borderColor: "#28a745",
};

const callScheduleTextColor = {
  color: "#007bff",
};

const followUpTextColor = {
  color: "#28a745",
};

const EditLeads = () => {
  const dispatch = useDispatch();
  const { data: leads, editable } = useSelector((state) => {
    console.log(state);
    return state.editLead;
  });
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("leads", leads);
    if (leads) {
      const initialValues = {
        ...leads,
        firstContactDate: leads.firstContactDate
          ? dayjs(leads.firstContactDate, "YYYY-MM-DD")
          : null,
        callSchedules: leads.callSchedules?.map((schedule) => ({
          ...schedule,
          callDate: schedule.callDate ? dayjs(schedule.callDate) : null,
          followUps: schedule.followUps
            ? schedule.followUps?.map((followUp) => ({
                ...followUp,
                followupDate: followUp.followupDate
                  ? dayjs(followUp.followupDate, "YYYY-MM-DD")
                  : null,
              }))
            : [],
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
  
      console.log("leads.id:", leads.id);
      console.log("leads._id:", leads._id);
  
      const leadId = leads.id
        ? leads.id
        : leads._id && typeof leads._id === 'object'
          ? `timestamp-${leads._id.timestamp}-date-${leads._id.date}`
          : null;
  
      console.log("leadId:", leadId); // Debugging to check what leadId is
  
      // Ensure leadId is a valid string before proceeding
      if (!leadId || typeof leadId !== 'string') {
        throw new Error("Invalid lead ID");
      }
  
      const updatedDataWithUTC = {
        ...updatedData,
        callSchedules: updatedData.callSchedules?.map((schedule) => {
          const callDate = schedule.callDate ? new Date(schedule.callDate) : null;
  
          if (callDate) {
            const timezoneOffset = -callDate.getTimezoneOffset() / 60;
            callDate.setHours(callDate.getHours() + timezoneOffset);
            callDate.setUTCHours(0, 0, 0, 0);
          }
  
          return {
            ...schedule,
            callDate: callDate ? callDate.toISOString() : null,
            followUps: schedule.followUps?.map((followUp) => {
              const followupDate = followUp.followupDate
                ? new Date(followUp.followupDate)
                : null;
  
              if (followupDate) {
                const timezoneOffset = -followupDate.getTimezoneOffset() / 60;
                followupDate.setHours(followupDate.getHours() + timezoneOffset);
                followupDate.setUTCHours(0, 0, 0, 0);
              }
  
              return {
                ...followUp,
                followupDate: followupDate ? followupDate.toISOString() : null,
              };
            }),
          };
        }),
      };
  
      // Dispatch with correctly formatted ID
      await dispatch(
        updateLead({ id: leadId, ...updatedDataWithUTC })
      ).unwrap();
  
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
    <React.Fragment>
      <div className="container">
        <Link to="/viewLeads">
          <Button style={{ marginBottom: 16 }}>Back</Button>
        </Link>

        {leads && (
          <Row justify="center" style={{ marginTop: 24 }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form
                form={form}
                layout="vertical"
                initialValues={form.getFieldsValue()}
              >
                <Card title="Lead Information" style={{ width: "100%" }}>
                  <Form.Item label="Company Name" name="companyName">
                    <Input readOnly={!editable} />
                  </Form.Item>
                  <Form.Item label="Inviter Name" name="inviterName">
                    <Input readOnly={!editable} />
                  </Form.Item>
                  <Form.Item label="Tech Stack" name="techStackName">
                    <Input readOnly={!editable} />
                  </Form.Item>
                  <Form.Item label="BD Name" name="bdName">
                    <Input readOnly={!editable} />
                  </Form.Item>
                  <Form.Item label="Dev Name" name="devName">
                    <Input readOnly={!editable} />
                  </Form.Item>
                  <Form.Item label="Profile Email" name="profileName">
                    <Input readOnly={!editable} />
                  </Form.Item>
                  <Form.Item label="Coordinator Name" name="coordinatorName">
                    <Input readOnly={!editable} />
                  </Form.Item>
                  <Form.Item name="status" label="Status">
                    <Select placeholder="Select a status" disabled={!editable}>
                      {Object.entries({
                        NEW: "New",
                        IN_PROGRESS: "In Progress",
                        COMPLETED: "Completed",
                        CLOSED: "Closed",
                      })?.map(([value, label]) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Description" name="description">
                    <Input.TextArea readOnly={!editable} />
                  </Form.Item>
                </Card>

                <Card title="Call Schedules" style={{ marginTop: 16 }}>
                  <Form.List name="callSchedules">
                    {(fields, { add, remove }) => (
                      <>
                        {fields?.map((field, index) => (
                          <Card
                            size="small"
                            key={field.key}
                            title={
                              <span style={callScheduleTextColor}>
                                Call Schedule {index + 1}
                              </span>
                            }
                            style={{
                              marginBottom: 20,
                              ...callScheduleStyle,
                            }}
                            extra={
                              editable &&
                              (index >= leads?.callSchedules?.length ? (
                                <Button
                                  type="link"
                                  onClick={() => remove(field.name)}
                                  danger
                                >
                                  Remove Schedule
                                </Button>
                              ) : null)
                            }
                          >
                            <Form.Item
                              label="Call Date"
                              name={[field.name, "callDate"]}
                            >
                              <DatePicker
                                format="YYYY-MM-DD"
                                disabled={!editable}
                              />
                            </Form.Item>
                            <Form.Item
                              label="Dev Name"
                              name={[field.name, "devName"]}
                            >
                              <Input readOnly={!editable} />
                            </Form.Item>
                            <Form.Item
                              label="Coordinator Name"
                              name={[field.name, "coordinatorName"]}
                            >
                              <Input readOnly={!editable} />
                            </Form.Item>
                            <Form.Item
                              label="Lead Company Name"
                              name={[field.name, "leadCompanyName"]}
                            >
                              <Input readOnly={!editable} />
                            </Form.Item>
                            <Form.Item
                              label="Call Notes"
                              name={[field.name, "notes"]}
                            >
                              <Input.TextArea readOnly={!editable} />
                            </Form.Item>
                            <Form.Item name={[field.name, "callCategory"]}>
                              <Radio.Group disabled={!editable}>
                                <Radio value="hr"> HR Round </Radio>
                                <Radio value="technical">Technical Round</Radio>
                              </Radio.Group>
                            </Form.Item>

                            <Form.List name={[field.name, "followUps"]}>
                              {(
                                subFields,
                                { add: addFollowUp, remove: removeFollowUp }
                              ) => (
                                <>
                                  {subFields?.map((subField, followIndex) => (
                                    <Space
                                      key={subField.key}
                                      style={{
                                        margin: 22,
                                      }}
                                    >
                                      <Card
                                        size="small"
                                        title={
                                          <span style={followUpTextColor}>
                                            Follow Up {followIndex + 1}
                                          </span>
                                        }
                                        style={{
                                          marginBottom: 16,
                                          ...followUpStyle,
                                        }}
                                        extra={
                                          editable &&
                                          leads?.callSchedules?.[index]
                                            ?.followUps &&
                                          followIndex >=
                                            leads.callSchedules[index].followUps
                                              .length ? (
                                            <Button
                                              type="link"
                                              onClick={() =>
                                                removeFollowUp(subField.name)
                                              }
                                              danger
                                            >
                                              Remove Follow-up
                                            </Button>
                                          ) : null
                                        }
                                      >
                                        <Form.Item
                                          label="Follow-up Date"
                                          name={[subField.name, "followupDate"]}
                                        >
                                          <DatePicker
                                            format="YYYY-MM-DD"
                                            disabled={!editable}
                                          />
                                        </Form.Item>
                                        <Form.Item
                                          label="Call Notes"
                                          name={[subField.name, "callNotes"]}
                                        >
                                          <Input.TextArea
                                            readOnly={!editable}
                                          />
                                        </Form.Item>
                                        <Form.Item
                                          name={[subField.name, "status"]}
                                          label="Status"
                                        >
                                          <Select
                                            placeholder="Select a status"
                                            disabled={!editable}
                                          >
                                            {Object.entries({
                                              NEW: "New",
                                              IN_PROGRESS: "In Progress",
                                              COMPLETED: "Completed",
                                              CLOSED: "Closed",
                                            })?.map(([value, label]) => (
                                              <Select.Option
                                                key={value}
                                                value={value}
                                              >
                                                {label}
                                              </Select.Option>
                                            ))}
                                          </Select>
                                        </Form.Item>
                                      </Card>
                                    </Space>
                                  ))}
                                  {editable && (
                                    <Form.Item>
                                      <Button
                                        onClick={() => addFollowUp()}
                                        block
                                      >
                                        Add Follow-up
                                      </Button>
                                    </Form.Item>
                                  )}
                                </>
                              )}
                            </Form.List>
                          </Card>
                        ))}
                        {editable && (
                          <Form.Item>
                            <Button onClick={() => add()} block>
                              Add Call Schedule
                            </Button>
                          </Form.Item>
                        )}
                      </>
                    )}
                  </Form.List>

                  {leads && editable && (
                    <Form.Item>
                      <Button type="primary" onClick={handleSave}>
                        Update
                      </Button>
                    </Form.Item>
                  )}
                </Card>
              </Form>
            </Col>
          </Row>
        )}
      </div>
    </React.Fragment>
  );
};

export default EditLeads;
