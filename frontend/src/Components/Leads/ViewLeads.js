import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Card, Spin, Alert, Row, Col, Button, Input, Form } from "antd";
import { viewLeads } from "../../features/data/Leads/viewLeadsSlice";
import { searchLeads } from "../../features/data/Leads/searchLeadsSlice";

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
  const { data: allLeads, status, error } = useSelector((state) => state.viewLeads);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(viewLeads());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      dispatch(searchLeads(searchQuery));
    }
  }, [searchQuery, dispatch]);

  const handleButtonClick = (filter) => {
    setSelectedFilter(filter);
    setSelectedItem(null);
  };

  // Handle card click for viewing lead details (both in default view and filtered view)
  const handleCardClick = (id, value) => {
    let leadsForItem;
    if (selectedFilter) {
      leadsForItem = allLeads.filter((lead) => lead[selectedFilter] === value);
    } else {
      leadsForItem = allLeads.filter((lead) => lead.id === id);
    }
    setSelectedItem({ value: id, leads: leadsForItem });
  };

  const handleBackClick = () => {
    setSelectedItem(null);
    setSelectedFilter(null);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value);
  };

  // Render the default view (group by lead id)
  const renderDefaultView = () => {
    return allLeads.map((lead) => (
      <Card
        key={lead.id}
        style={{ marginBottom: 16, cursor: "pointer" }}
        onClick={() => handleCardClick(lead.id)} // Card is clickable to show full details
      >
        <div><strong>Company Name:</strong> {lead.companyName}</div>
        <div><strong>Tech Stack:</strong> {lead.techStackName}</div>
        <div><strong>BD Name:</strong> {lead.bdName}</div>
        <div><strong>Developer:</strong> {lead.devName}</div>
        <div><strong>Profile:</strong> {lead.profileName}</div>
        <div><strong>Coordinator:</strong> {lead.coordinatorName}</div>
        <div><strong>Status:</strong> {lead.status}</div>
      </Card>
    ));
  };

  // Render the filtered cards when a filter is selected
  const renderFilterCards = () => {
    const filterValues = [...new Set(allLeads.map((lead) => lead[selectedFilter]))].filter(Boolean);

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
          <div><strong>{value}</strong></div>
          <ul>
            {leadNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </Card>
      );
    });
  };

  // Render detailed view of a selected lead
  const renderLeadDetails = () => {
    if (!selectedItem) return null;

    return selectedItem.leads.map((lead) => (
      <Card key={lead.id} style={{ marginBottom: 16 }}>
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
      <Row gutter={20} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <div>
            <Form layout="inline" onSubmit={handleSearch} style={{ 
              marginBottom: 20,
              marginTop: 20, 
              marginLeft: "2%"
            }}>
              <Form.Item>
                <Input
                  name="search"
                  placeholder="Search..."
                  style={{ width: 300 }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </Form>
            <Button onClick={() => handleButtonClick("devName")} style={{ marginRight: 8 }}>
              Dev Name
            </Button>
            <Button onClick={() => handleButtonClick("bdName")} style={{ marginRight: 8 }}>
              BD Name
            </Button>
            <Button onClick={() => handleButtonClick("coordinatorName")} style={{ marginRight: 8 }}>
              Coordinator Name
            </Button>
            <Button onClick={() => handleButtonClick("techStackName")} style={{ marginRight: 8 }}>
              Tech Stack Name
            </Button>
            <Button onClick={() => handleButtonClick("profileName")} style={{ marginRight: 8 }}>
              Profile Name
            </Button>
          </div>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={24}>
          <Card title={selectedFilter ? `Grouped by ${selectedFilter}` : 'All Leads'} bordered={false}>
            {status === "loading" ? (
              <Spin size="large" />
            ) : error ? (
              <Alert message={error} type="error" />
            ) : (
              <div>
                {selectedItem ? (
                  <>
                    <Button onClick={handleBackClick} style={{ marginBottom: 16 }}>
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