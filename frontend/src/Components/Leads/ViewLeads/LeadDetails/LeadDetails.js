// LeadDetails.js
import React from 'react';
import { Card, Button, Descriptions } from 'antd';
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>{lead.companyName}</h2>
            <Button type="primary" onClick={() => handleEditLead(lead)}>
              Edit Lead
            </Button>
          </div>
          <Descriptions
            bordered
            column={1}
            size="small"
            style={{ marginTop: 16 }}
          >
            {Object.entries(lead)
              .filter(
                ([key]) =>
                  key !== '_id' &&
                  key !== 'firstContactDate' &&
                  key !== 'callSchedules' &&
                  key !== '_class'
              )
              .map(([key, value]) => {
                // Handle nested objects or dates
                let displayValue = value;
                if (value && value.$date) {
                  displayValue = formatDate(value.$date);
                } else if (Array.isArray(value)) {
                  displayValue = value.join(', ');
                } else if (typeof value === 'object') {
                  displayValue = JSON.stringify(value);
                }
                return (
                  <Descriptions.Item
                    label={key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                    key={key}
                  >
                    {displayValue}
                  </Descriptions.Item>
                );
              })}
          </Descriptions>

          {lead.callSchedules?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3>Call Schedules</h3>
              {lead.callSchedules.map((schedule, idx) => (
                <Card
                  key={idx}
                  type="inner"
                  title={`Call on ${formatDate(
                    schedule.callDate.$date,
                    'YYYY-MM-DD'
                  )}`}
                  style={{ marginBottom: 16 }}
                >
                  <Descriptions bordered column={1} size="small">
                    {Object.entries(schedule)
                      .filter(([key]) => key !== 'followUps')
                      .map(([key, value]) => {
                        let displayValue = value;
                        if (value && value.$date) {
                          displayValue = formatDate(value.$date);
                        } else if (Array.isArray(value)) {
                          displayValue = value.join(', ');
                        } else if (typeof value === 'object') {
                          displayValue = JSON.stringify(value);
                        }
                        return (
                          <Descriptions.Item
                            label={key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (str) => str.toUpperCase())}
                            key={key}
                          >
                            {displayValue}
                          </Descriptions.Item>
                        );
                      })}
                  </Descriptions>

                  {schedule.followUps?.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <h4>Follow-ups</h4>
                      {schedule.followUps.map((followUp, fIdx) => (
                        <Card
                          key={fIdx}
                          type="inner"
                          style={{ marginBottom: 16 }}
                          title={`Follow-up on ${formatDate(
                            followUp.followupDate.$date,
                            'YYYY-MM-DD'
                          )}`}
                        >
                          <Descriptions bordered column={1} size="small">
                            {Object.entries(followUp).map(([key, value]) => {
                              let displayValue = value;
                              if (value && value.$date) {
                                displayValue = formatDate(value.$date);
                              } else if (Array.isArray(value)) {
                                displayValue = value.join(', ');
                              } else if (typeof value === 'object') {
                                displayValue = JSON.stringify(value);
                              }
                              return (
                                <Descriptions.Item
                                  label={key
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, (str) => str.toUpperCase())}
                                  key={key}
                                >
                                  {displayValue}
                                </Descriptions.Item>
                              );
                            })}
                          </Descriptions>
                        </Card>
                      ))}
                    </div>
                  )}
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