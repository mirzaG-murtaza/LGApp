import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Card, Spin, Alert, Row, Col, Button, Modal, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons"; // Import the filter icon
import { viewLeads } from "../../features/data/Leads/viewLeadsSlice";
import { Option } from "antd/es/mentions";
import { searchLeads } from "../../features/data/Leads/searchLeadsSlice";
import { useNavigate } from "react-router-dom";
import { setData } from "../../features/data/Leads/getEditLeadSlice";

const callScheduleStyle = {
  boxShadow: "0 4px 8px rgba(0, 123, 255, 0.6)",
  borderColor: "#007bff",
};

const followUpStyle = {
  boxShadow: "0 4px 8px rgba(40, 167, 69, 0.6)",
  borderColor: "#28a745",
};

const ViewLeads = () => {
  const dispatch = useDispatch();
  const {
    data: allLeads,
    status,
    error,
  } = useSelector((state) => state.viewLeads);

  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [selectedFilters, setSelectedFilters] = useState({
    devName: [],
    bdName: [],
    coordinatorName: [],
    profileName: [],
    techStackName: [],
  });

  useEffect(() => {
    dispatch(viewLeads());
  }, [dispatch]);

  const handleButtonClick = (filter) => {
    setSelectedFilter(filter);
    setSelectedItem(null);
  };

  const generateFilterString = (filters) => {
    let filterParts = [];

    if (filters.companyName && filters.companyName.length > 0) {
      const companyNameFilter = filters.companyName
        .map((name) => `'$companyName' = '${name}'`)
        .join(" or ");
      filterParts.push(`(${companyNameFilter})`);
    }

    if (filters.inviterName && filters.inviterName.length > 0) {
      const inviterNameFilter = filters.inviterName
        .map((name) => `'$inviterName' = '${name}'`)
        .join(" or ");
      filterParts.push(`(${inviterNameFilter})`);
    }

    if (filters.techStack && filters.techStack.length > 0) {
      const techStackFilter = filters.techStack
        .map((stack) => `'$techStackName' = '${stack}'`)
        .join(" or ");
      filterParts.push(`(${techStackFilter})`);
    }

    if (filters.bdName && filters.bdName.length > 0) {
      const bdNameFilter = filters.bdName
        .map((name) => `'$bdName' = '${name}'`)
        .join(" or ");
      filterParts.push(`(${bdNameFilter})`);
    }

    if (filters.devName && filters.devName.length > 0) {
      const devNameFilter = filters.devName
        .map((name) => `'$devName' = '${name}'`)
        .join(" or ");
      filterParts.push(`(${devNameFilter})`);
    }

    if (filters.coordinatorName && filters.coordinatorName.length > 0) {
      const coordinatorNameFilter = filters.coordinatorName
        .map((name) => `'$coordinatorName' = '${name}'`)
        .join(" or ");
      filterParts.push(`(${coordinatorNameFilter})`);
    }

    if (filters.profileName && filters.profileName.length > 0) {
      const profileNameFilter = filters.profileName
        .map((name) => `'$profileName' = '${name}'`)
        .join(" or ");
      filterParts.push(`(${profileNameFilter})`);
    }

    if (filters.status && filters.status.length > 0) {
      const statusFilter = filters.status
        .map((status) => `'$status' = '${status}'`)
        .join(" or ");
      filterParts.push(`(${statusFilter})`);
    }

    return filterParts.length > 0 ? filterParts.join(" and ") : "";
  };

  const handleCardClick = (id, value) => {
    let leadsForItem;
    if (selectedFilter) {
      leadsForItem = allLeads.filter((lead) => lead[selectedFilter] === value);
    } else {
      leadsForItem = allLeads.filter((lead) => lead.id === id);
    }
    setSelectedItem({ value: id, leads: leadsForItem });
  };

  const handleEditLead = (lead) => {
    dispatch(setData(lead))
    navigate("/editLead")
  }

  const handleBackClick = () => {
    setSelectedItem(null);
    setSelectedFilter(null);
  };

  const showFilterModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const renderDefaultView = () => {
    return allLeads.map((lead) => (
      <Card
        key={lead.id}
        style={{ marginBottom: 16, cursor: "pointer" }}
        onClick={() => handleCardClick(lead.id)} // Card is clickable to show full details
      >
        <div>
          <strong>Company Name:</strong> {lead.companyName}
        </div>
        <div>
          <strong>Tech Stack:</strong> {lead.techStackName}
        </div>
        <div>
          <strong>BD Name:</strong> {lead.bdName}
        </div>
        <div>
          <strong>Developer:</strong> {lead.devName}
        </div>
        <div>
          <strong>Profile:</strong> {lead.profileName}
        </div>
        <div>
          <strong>Coordinator:</strong> {lead.coordinatorName}
        </div>
        <div>
          <strong>Status:</strong> {lead.status}
        </div>
      </Card>
    ));
  };

  const renderFilterCards = () => {
    const filterValues = [
      ...new Set(allLeads.map((lead) => lead[selectedFilter])),
    ].filter(Boolean);

    return filterValues.map((value) => {
      const leadNames = allLeads
        .filter((lead) => lead[selectedFilter] === value)
        .map((lead) => lead.companyName);

      return (
        <Card
          key={value}
          style={{ marginBottom: 16, cursor: "pointer" }}
          onClick={() => handleCardClick(null, value)}
        >
          <div>
            <strong>{value}</strong>
          </div>
          <ul>
            {leadNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </Card>
      );
    });
  };

  const renderLeadDetails = () => {
    if (!selectedItem) return null;

    return selectedItem.leads.map((lead) => (
      <Card key={lead.id} style={{ marginBottom: 16 }}>
        <div style={{ justifyContent: "space-between", display: "flex" }}>
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>First Contact Date:</strong>{" "}
              {dayjs(lead.firstContactDate).format("YYYY-MM-DD")}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Company Name:</strong> {lead.companyName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Inviter Name:</strong> {lead.inviterName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Tech Stack Name:</strong> {lead.techStackName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>BD Name:</strong> {lead.bdName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Dev Name:</strong> {lead.devName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Profile Name:</strong> {lead.profileName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Coordinator Name:</strong> {lead.coordinatorName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Status:</strong> {lead.status}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Description:</strong> {lead.description}
            </div>
          </div>
          <div>
            <Button onClick={()=>handleEditLead(lead)}
              style={{ marginBottom: 16 }} type="primary">
              Edit Lead
            </Button>
          </div>
        </div>
        {lead.callSchedules && (
          <div>
            <h4>Call Schedules:</h4>
            {lead.callSchedules.map((schedule) => (
              <Card
                key={schedule.id}
                style={{
                  marginBottom: 8,
                  ...(schedule.status === "COMPLETED"
                    ? followUpStyle
                    : callScheduleStyle),
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <strong>Call Date:</strong>{" "}
                  {dayjs(schedule.callDate).format("YYYY-MM-DD HH:mm:ss")}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Notes:</strong> {schedule.notes}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Lead Company Name:</strong> {schedule.leadCompanyName}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Coordinator Name:</strong> {schedule.coordinatorName}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Dev Name:</strong> {schedule.devName}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Call Category:</strong> {schedule.callCategory}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <h4>Follow-ups:</h4>
                  {schedule.followUps.map((followUp) => (
                    <Card
                      key={followUp.id}
                      style={{
                        marginBottom: 4,
                        ...(followUp.status === "COMPLETED"
                          ? followUpStyle
                          : callScheduleStyle),
                      }}
                    >
                      <div style={{ marginBottom: 4 }}>
                        <strong>Follow-up Date:</strong>{" "}
                        {dayjs(followUp.followupDate).format("YYYY-MM-DD")}
                      </div>
                      <div style={{ marginBottom: 4 }}>
                        <strong>Call Notes:</strong> {followUp.callNotes}
                      </div>
                      <div style={{ marginBottom: 4 }}>
                        <strong>Status:</strong> {followUp.status}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    ));
  };

  return (
    <div>
      <Row gutter={20} style={{ marginBottom: 20, marginTop: 20 }}>
        <Col span={24}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FilterOutlined
              style={{ fontSize: "20px", marginRight: 16, cursor: "pointer" }}
              onClick={showFilterModal} // Show modal when the filter icon is clicked
            />
            <Button
              onClick={() => handleButtonClick("devName")}
              style={{ marginRight: 8 }}
            >
              Dev Name
            </Button>
            <Button
              onClick={() => handleButtonClick("bdName")}
              style={{ marginRight: 8 }}
            >
              BD Name
            </Button>
            <Button
              onClick={() => handleButtonClick("coordinatorName")}
              style={{ marginRight: 8 }}
            >
              Coordinator Name
            </Button>
            <Button
              onClick={() => handleButtonClick("techStackName")}
              style={{ marginRight: 8 }}
            >
              Tech Stack Name
            </Button>
            <Button
              onClick={() => handleButtonClick("profileName")}
              style={{ marginRight: 8 }}
            >
              Profile Name
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modal for Filtering */}
      <Modal
        title="Filter Leads"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={() => {
          const filterString = generateFilterString(selectedFilters);
          const query = `${filterString}`
          dispatch(searchLeads(query))
          console.log(query);
          setIsModalVisible(false);
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Company Name */}
          <div>
            <h4>Company Name</h4>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select Company Names"
              style={{ width: "100%" }}
              value={selectedFilters.companyName}
              onChange={(value) =>
                setSelectedFilters({ ...selectedFilters, companyName: value })
              }
            >
              {Array.from(
                new Set(allLeads.map((lead) => lead.companyName))
              ).map((companyName) => (
                <Option key={companyName} value={companyName}>
                  {companyName}
                </Option>
              ))}
            </Select>
          </div>

          {/* Inviter Name */}
          <div>
            <h4>Inviter Name</h4>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select Inviter Names"
              style={{ width: "100%" }}
              value={selectedFilters.inviterName}
              onChange={(value) =>
                setSelectedFilters({ ...selectedFilters, inviterName: value })
              }
            >
              {Array.from(
                new Set(allLeads.map((lead) => lead.inviterName))
              ).map((inviterName) => (
                <Option key={inviterName} value={inviterName}>
                  {inviterName}
                </Option>
              ))}
            </Select>
          </div>

          {/* Tech Stack */}
          <div>
            <h4>Tech Stack</h4>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select Tech Stack"
              style={{ width: "100%" }}
              value={selectedFilters.techStack}
              onChange={(value) =>
                setSelectedFilters({ ...selectedFilters, techStack: value })
              }
            >
              {Array.from(
                new Set(allLeads.map((lead) => lead.techStackName))
              ).map((techStack) => (
                <Option key={techStack} value={techStack}>
                  {techStack}
                </Option>
              ))}
            </Select>
          </div>

          {/* BD Name */}
          <div>
            <h4>BD Name</h4>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select BD Names"
              style={{ width: "100%" }}
              value={selectedFilters.bdName}
              onChange={(value) =>
                setSelectedFilters({ ...selectedFilters, bdName: value })
              }
            >
              {Array.from(new Set(allLeads.map((lead) => lead.bdName))).map(
                (bdName) => (
                  <Option key={bdName} value={bdName}>
                    {bdName}
                  </Option>
                )
              )}
            </Select>
          </div>

          {/* Dev Name */}
          <div>
            <h4>Dev Name</h4>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select Dev Names"
              style={{ width: "100%" }}
              value={selectedFilters.devName}
              onChange={(value) =>
                setSelectedFilters({ ...selectedFilters, devName: value })
              }
            >
              {Array.from(new Set(allLeads.map((lead) => lead.devName))).map(
                (devName) => (
                  <Option key={devName} value={devName}>
                    {devName}
                  </Option>
                )
              )}
            </Select>
          </div>

          {/* Coordinator Name */}
          <div>
            <h4>Coordinator Name</h4>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select Coordinator Names"
              style={{ width: "100%" }}
              value={selectedFilters.coordinatorName}
              onChange={(value) =>
                setSelectedFilters({
                  ...selectedFilters,
                  coordinatorName: value,
                })
              }
            >
              {Array.from(
                new Set(allLeads.map((lead) => lead.coordinatorName))
              ).map((coordinatorName) => (
                <Option key={coordinatorName} value={coordinatorName}>
                  {coordinatorName}
                </Option>
              ))}
            </Select>
          </div>

          {/* Profile Name */}
          <div>
            <h4>Profile Name</h4>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select Profile Names"
              style={{ width: "100%" }}
              value={selectedFilters.profileName}
              onChange={(value) =>
                setSelectedFilters({ ...selectedFilters, profileName: value })
              }
            >
              {Array.from(
                new Set(allLeads.map((lead) => lead.profileName))
              ).map((profileName) => (
                <Option key={profileName} value={profileName}>
                  {profileName}
                </Option>
              ))}
            </Select>
          </div>

          {/* Status */}
          <div>
            <h4>Status</h4>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select Status"
              style={{ width: "100%" }}
              value={selectedFilters.status}
              onChange={(value) =>
                setSelectedFilters({ ...selectedFilters, status: value })
              }
            >
              <Option value="NEW">NEW</Option>
              <Option value="IN_PROGRESS">IN_PROGRESS</Option>
              <Option value="CLOSED">CLOSED</Option>
            </Select>
          </div>
        </div>
      </Modal>

      <Row gutter={20}>
        <Col span={24}>
          <Card
            title={
              selectedFilter ? `Grouped by ${selectedFilter}` : "All Leads"
            }
            bordered={false}
          >
            {status === "loading" ? (
              <Spin size="large" />
            ) : error ? (
              <Alert message={error} type="error" />
            ) : (
              <div>
                {selectedItem ? (
                  <>
                    <Button
                      onClick={handleBackClick}
                      style={{ marginBottom: 16 }}
                    >
                      Back
                    </Button>
                    {renderLeadDetails()}
                  </>
                ) : selectedFilter ? (
                  renderFilterCards()
                ) : (
                  renderDefaultView()
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewLeads;
