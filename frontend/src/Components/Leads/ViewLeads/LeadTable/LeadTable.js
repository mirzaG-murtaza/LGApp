// LeadTable.js
import React from 'react';
import { Table } from 'antd';
import { capitalizeStatus } from '../Shared/utils';

const LeadTable = ({ leadsToDisplay, handleCardClick }) => {
  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: 'Tech Stack',
      dataIndex: 'techStackName',
      key: 'techStackName',
      sorter: (a, b) => a.techStackName.localeCompare(b.techStackName),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => capitalizeStatus(text),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={leadsToDisplay}
      rowKey={(record) => record.id}
      onRow={(record) => {
        return {
          onClick: () => handleCardClick(record.id),
        };
      }}
      style={{ cursor: 'pointer' }}
      locale={{
        emptyText: 'No leads found for the selected date range.',
      }}
    />
  );
};

export default LeadTable;