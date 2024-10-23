// FilterModal.js
import React, { useState, useMemo } from 'react';
import { Modal, Select, AutoComplete, Input } from 'antd';
import { FILTER_KEYS } from '../Shared/constants';

const FilterModal = ({
  visible,
  onCancel,
  onSubmit,
  leadsToDisplay,
  initialFilters,
  initialSearchQuery,
  suggestions,
  handleSearchChange,
  handleSelect,
  autoCompleteOptions,
}) => {
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const uniqueValues = useMemo(() => {
    const getUniqueValues = (key) => {
      return Array.from(new Set(leadsToDisplay.map((lead) => lead[key]))).filter(Boolean);
    };
    return getUniqueValues;
  }, [leadsToDisplay]);

  const renderFilterOptions = () => {
    return Object.values(FILTER_KEYS).map((key) => (
      <div key={key}>
        <h4>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
        <Select
          mode="multiple"
          showSearch
          placeholder={`Search and select ${key}`}
          style={{ width: '100%' }}
          value={selectedFilters[key]}
          onChange={(value) => setSelectedFilters({ ...selectedFilters, [key]: value })}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {uniqueValues(key).map((val) => (
            <Select.Option key={val} value={val}>
              {val}
            </Select.Option>
          ))}
        </Select>
      </div>
    ));
  };

  return (
    <Modal
      title="Filter Leads"
      visible={visible}
      onCancel={onCancel}
      onOk={() => onSubmit(selectedFilters, searchQuery)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {renderFilterOptions()}
        <div>
          <h4>Query Search</h4>
          <AutoComplete
            style={{ width: '100%' }}
            options={autoCompleteOptions.map((option) => ({ value: option }))}
            value={searchQuery}
            onSearch={(value) => {
              setSearchQuery(value);
              handleSearchChange(value);
            }}
            onSelect={handleSelect}
            placeholder="Enter query..."
          >
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={() => onSubmit(selectedFilters, searchQuery)}
            />
          </AutoComplete>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;