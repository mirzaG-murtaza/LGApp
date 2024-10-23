// LeadDetails.js
import React from 'react';
import { Card, Button } from 'antd';
import { formatDate, capitalizeStatus } from '../Shared/utils';

const LeadDetails = ({ selectedItem, handleEditLead, handleBackClick }) => {
  if (!selectedItem) return null;

  return (
    <>
      <Button onClick={handleBackClick} style={{ marginBottom: 16 }}>
        Back
      </Button>
      {selectedItem.leads.map((lead) => (
        <Card key={lead.id} style={{ marginBottom: 16 }}>
          <div style={{ justifyContent: 'space-between', display: 'flex' }}>
            <div>
              <div style={{ marginBottom: 8 }}>
                <strong>First Contact Date:</strong> {formatDate(lead.firstContactDate)}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Company Name:</strong> {lead.companyName}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Company Email:</strong> {lead.companyEmail}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Status:</strong> {capitalizeStatus(lead.status)}
              </div>
            </div>
            <div>
              <Button
                onClick={() => handleEditLead(lead)}
                style={{ marginBottom: 16 }}
                type="primary"
              >
                Edit Lead
              </Button>
            </div>
          </div>
          {lead?.callSchedules?.length > 0 && (
            <div>
              <h4>Call Schedules:</h4>
              {lead.callSchedules.map((schedule, idx) => (
                <Card
                  key={idx}
                  style={{
                    marginBottom: 8,
                    boxShadow:
                      schedule.callStatus === 'COMPLETED'
                        ? '0 4px 8px rgba(40, 167, 69, 0.6)'
                        : '0 4px 8px rgba(0, 123, 255, 0.6)',
                    borderColor:
                      schedule.callStatus === 'COMPLETED' ? '#28a745' : '#007bff',
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <strong>Call Date:</strong> {formatDate(schedule.callDate, 'YYYY-MM-DD HH:mm:ss')}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Call Status:</strong> {capitalizeStatus(schedule.callStatus)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      ))}
    </>
  );
};

export default LeadDetails;