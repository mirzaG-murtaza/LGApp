// LeadCards.js
import React from 'react';
import { Card, Table, Alert } from 'antd';
import { capitalizeStatus } from '../Shared/utils';

const LeadCards = ({
  leadsToDisplay,
  selectedFilter,
  viewMode,
  handleCardClick,
  countCalls,
}) => {
  const filterValues = [
    ...new Set(leadsToDisplay.map((lead) => lead[selectedFilter])),
  ].filter(Boolean);

  const tableData = [];

  filterValues.forEach((value) => {
    const leadsForItem = leadsToDisplay
      .filter((lead) => lead[selectedFilter] === value)
      .map((lead) => ({
        key: lead.id,
        [selectedFilter]: value,
        companyName: lead.companyName,
        status: lead.status,
        numCalls: lead.callSchedules ? lead.callSchedules.length : 0,
      }));

    tableData.push(...leadsForItem);
  });

  const groupedColumns = [
    {
      title: selectedFilter
        ? selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)
        : '',
      dataIndex: selectedFilter,
      key: selectedFilter,
      sorter: (a, b) => a[selectedFilter].localeCompare(b[selectedFilter]),
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => capitalizeStatus(text),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Number of Calls',
      dataIndex: 'numCalls',
      key: 'numCalls',
      sorter: (a, b) => a.numCalls - b.numCalls,
    },
  ];

  if (viewMode === 'table') {
    return tableData.length > 0 ? (
      <Table
        columns={groupedColumns}
        dataSource={tableData}
        rowKey={(record) => record.key}
        onRow={(record) => {
          return {
            onClick: () => handleCardClick(null, record[selectedFilter]),
          };
        }}
        pagination={{ pageSize: 10 }}
        style={{ cursor: 'pointer' }}
        locale={{
          emptyText: 'No leads found for the selected filters and date range.',
        }}
      />
    ) : (
      <Alert
        message="No leads found for the selected filters and date range."
        type="info"
        showIcon
      />
    );
  } else {
    return filterValues.length > 0 ? (
      filterValues.map((value) => {
        const leadsForItem = leadsToDisplay
          .filter((lead) => lead[selectedFilter] === value)
          .map((lead) => ({
            companyName: lead.companyName,
            status: lead.status,
            numCalls: lead.callSchedules ? lead.callSchedules.length : 0,
          }));

        return (
          <Card
            key={value}
            style={{ marginBottom: 16, cursor: 'pointer' }}
            onClick={() => handleCardClick(null, value)}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <strong>{value}</strong>
              <span>
                <strong>Calls:</strong> {countCalls(selectedFilter, value)}{' '}
              </span>
            </div>
            <ol>
              {leadsForItem.map((lead, index) => (
                <li key={index}>
                  {lead.companyName}{' '}
                  <span style={{ color: 'gray' }}>
                    ({capitalizeStatus(lead.status)} - Calls: {lead.numCalls})
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        );
      })
    ) : (
      <Alert
        message="No leads found for the selected filters and date range."
        type="info"
        showIcon
      />
    );
  }
};

export default LeadCards;