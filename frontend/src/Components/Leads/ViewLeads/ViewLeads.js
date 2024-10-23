// ViewLeads.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Spin, Alert, Row, Col, Button, Switch, DatePicker } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { searchLeads } from '../../../features/data/Leads/searchLeadsSlice';
import { useNavigate } from 'react-router-dom';
import { setData } from '../../../features/data/Leads/getEditLeadSlice';
import { FILTER_KEYS } from './Shared/constants';
import FilterModal from './FilterModal/FilterModal';
import LeadDetails from './LeadDetails/LeadDetails';
import LeadTable from './LeadTable/LeadTable';
import LeadCards from './LeadCards/LeadCards';

const { RangePicker } = DatePicker;

const ViewLeads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: filteredLeads,
    status: searchStatus,
    error: searchError,
  } = useSelector((state) => state.searchLeads);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    companyName: [],
    inviterName: [],
    techStackName: [],
    bdName: [],
    devName: [],
    coordinatorName: [],
    profileName: [],
    status: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [viewMode, setViewMode] = useState('summary');
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const [customDateRange, setCustomDateRange] = useState(null);

  const suggestions = useMemo(() => {
    return Object.values(FILTER_KEYS);
  }, []);

  const delimitersRegex = /([\s()'])/;

  const leadsToDisplay = filteredLeads.length > 0 ? filteredLeads : [];

  const generateDateRangeQuery = useCallback(() => {
    const now = dayjs();
    let query = '';

    if (customDateRange) {
      const [start, end] = customDateRange;
      query = `('First Contact Date' >= '${start
        .startOf('day')
        .toISOString()}' and 'First Contact Date' <= '${end
        .endOf('day')
        .toISOString()}')`;
    } else {
      if (selectedDateRange === 'today') {
        query = `('First Contact Date' >= '${now
          .startOf('day')
          .toISOString()}' and 'First Contact Date' <= '${now
          .endOf('day')
          .toISOString()}')`;
      } else if (selectedDateRange === 'week') {
        const sevenDaysAgo = now.subtract(7, 'day');
        query = `('First Contact Date' >= '${sevenDaysAgo
          .startOf('day')
          .toISOString()}' and 'First Contact Date' <= '${now
          .endOf('day')
          .toISOString()}')`;
      } else if (selectedDateRange === 'month') {
        const thirtyDaysAgo = now.subtract(30, 'day');
        query = `('First Contact Date' >= '${thirtyDaysAgo
          .startOf('day')
          .toISOString()}' and 'First Contact Date' <= '${now
          .endOf('day')
          .toISOString()}')`;
      }
    }

    return query;
  }, [customDateRange, selectedDateRange]);

  useEffect(() => {
    const dateRangeQuery = generateDateRangeQuery();
    dispatch(searchLeads(dateRangeQuery));
  }, [selectedDateRange, customDateRange, dispatch, generateDateRangeQuery]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);

      const tokens = value.split(delimitersRegex);
      let lastTokenIndex = tokens.length - 1;
      while (lastTokenIndex >= 0 && delimitersRegex.test(tokens[lastTokenIndex])) {
        lastTokenIndex--;
      }

      const lastToken = lastTokenIndex >= 0 ? tokens[lastTokenIndex] : '';

      const filteredOptions = suggestions.filter((option) =>
        option.toLowerCase().includes(lastToken.toLowerCase())
      );

      setAutoCompleteOptions(filteredOptions);
    },
    [suggestions, delimitersRegex]
  );

  const handleSelect = useCallback(
    (value) => {
      const tokens = searchQuery.split(delimitersRegex);

      let lastTokenIndex = tokens.length - 1;
      while (lastTokenIndex >= 0 && delimitersRegex.test(tokens[lastTokenIndex])) {
        lastTokenIndex--;
      }

      if (lastTokenIndex >= 0) {
        tokens[lastTokenIndex] = value;
      }

      const newValue = tokens.join('');

      setSearchQuery(newValue);
    },
    [searchQuery, delimitersRegex]
  );

  const generateFilterString = useCallback((filters) => {
    let filterParts = [];

    Object.keys(filters).forEach((filterKey) => {
      const values = filters[filterKey];
      if (values && values.length > 0) {
        const mappedMongoField = `'$${filterKey}'`;
        const condition = values
          .map((value) => `(${mappedMongoField} = '${value}')`)
          .join(' or ');
        filterParts.push(`(${condition})`);
      }
    });

    return filterParts.join(' and ');
  }, []);

  const handleModalSubmit = useCallback(
    (filters, query) => {
      const filterString = generateFilterString(filters);
      setIsModalVisible(false);
      setSelectedFilter(null);
      setSearchQuery('');

      const dateRangeQuery = generateDateRangeQuery();
      const finalQuery = filterString
        ? `(${filterString}) and ${dateRangeQuery}`
        : dateRangeQuery;
      dispatch(searchLeads(finalQuery));
    },
    [dispatch, generateDateRangeQuery, generateFilterString]
  );

  const handleSearchSubmit = useCallback(
    (filters, query) => {
      setIsModalVisible(false);
      setSelectedFilter(null);
      setSelectedFilters({
        companyName: [],
        inviterName: [],
        techStackName: [],
        bdName: [],
        devName: [],
        coordinatorName: [],
        profileName: [],
        status: [],
      });

      const dateRangeQuery = generateDateRangeQuery();
      const finalQuery = query.trim()
        ? `(${query.trim()}) and ${dateRangeQuery}`
        : dateRangeQuery;
      dispatch(searchLeads(finalQuery));
    },
    [dispatch, generateDateRangeQuery]
  );

  const handleDateRangeClick = useCallback((range) => {
    setSelectedDateRange(range);
    setCustomDateRange(null);
  }, []);

  const handleCustomDateRange = useCallback((dates, dateStrings) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      setCustomDateRange([start, end]);
      setSelectedDateRange(null);
    } else {
      setCustomDateRange(null);
    }
  }, []);

  const handleButtonClick = useCallback((filter) => {
    setSelectedFilter(filter);
    setSelectedItem(null);
  }, []);

  const handleCardClick = useCallback(
    (id, value) => {
      let leadsForItem;
      if (leadsToDisplay.length !== 0) {
        if (selectedFilter) {
          leadsForItem = leadsToDisplay.filter((lead) => lead[selectedFilter] === value);
        } else {
          leadsForItem = leadsToDisplay.filter((lead) => lead.id === id);
        }
      } else {
        leadsForItem = [];
      }
      setSelectedItem({ value: id || value, leads: leadsForItem });
    },
    [leadsToDisplay, selectedFilter]
  );

  const handleEditLead = useCallback(
    (lead) => {
      dispatch(setData(lead));
      navigate('/editLeads');
    },
    [dispatch, navigate]
  );

  const handleBackClick = useCallback(() => {
    setSelectedItem(null);
    setSelectedFilter(null);
  }, []);

  const showFilterModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const countCalls = useCallback(
    (filterType, value) => {
      return leadsToDisplay
        ?.filter((lead) => lead[filterType] === value)
        .reduce((acc, lead) => acc + (lead.callSchedules?.length || 0), 0);
    },
    [leadsToDisplay]
  );

  return (
    <div>
      <Row gutter={20} style={{ marginBottom: 20, marginTop: 20 }}>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FilterOutlined
              style={{ fontSize: '20px', marginRight: 16, cursor: 'pointer' }}
              onClick={showFilterModal}
            />

            <Button
              onClick={() => handleButtonClick('devName')}
              style={{ marginRight: 8 }}
            >
              Dev Name
            </Button>
            <Button
              onClick={() => handleButtonClick('bdName')}
              style={{ marginRight: 8 }}
            >
              BD Name
            </Button>
            <Button
              onClick={() => handleButtonClick('coordinatorName')}
              style={{ marginRight: 8 }}
            >
              Coordinator Name
            </Button>
            <Button
              onClick={() => handleButtonClick('techStackName')}
              style={{ marginRight: 8 }}
            >
              Tech Stack Name
            </Button>
            <Button
              onClick={() => handleButtonClick('profileName')}
              style={{ marginRight: 8 }}
            >
              Profile Name
            </Button>

            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RangePicker
                style={{ marginRight: 16 }}
                onChange={handleCustomDateRange}
                disabledDate={(current) => {
                  return current && current > dayjs().endOf('day');
                }}
                placeholder={['From', 'To']}
              />

              <Button
                type={
                  selectedDateRange === 'today' && !customDateRange
                    ? 'primary'
                    : 'default'
                }
                onClick={() => handleDateRangeClick('today')}
                style={{ marginRight: 8 }}
              >
                Today
              </Button>
              <Button
                type={
                  selectedDateRange === 'week' && !customDateRange
                    ? 'primary'
                    : 'default'
                }
                onClick={() => handleDateRangeClick('week')}
                style={{ marginRight: 8 }}
              >
                Week
              </Button>
              <Button
                type={
                  selectedDateRange === 'month' && !customDateRange
                    ? 'primary'
                    : 'default'
                }
                onClick={() => handleDateRangeClick('month')}
              >
                Month
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <FilterModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={(filters, query) => {
          if (query.trim()) {
            handleSearchSubmit(filters, query);
          } else {
            handleModalSubmit(filters, query);
          }
        }}
        leadsToDisplay={leadsToDisplay}
        initialFilters={selectedFilters}
        initialSearchQuery={searchQuery}
        suggestions={suggestions}
        handleSearchChange={handleSearchChange}
        handleSelect={handleSelect}
        autoCompleteOptions={autoCompleteOptions}
      />

      <Row gutter={20}>
        <Col span={24}>
          <Card
            title={
              selectedFilter ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {`Grouped by ${selectedFilter}`}
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{ marginRight: 8 }}>Summary View</span>
                    <Switch
                      checked={viewMode === 'table'}
                      onChange={(checked) =>
                        setViewMode(checked ? 'table' : 'summary')
                      }
                    />
                    <span style={{ marginLeft: 8 }}>Tabular View</span>
                  </div>
                </div>
              ) : (
                'Leads from the Last 30 Days'
              )
            }
            bordered={false}
          >
            {searchStatus === 'loading' ? (
              <Spin size="large" />
            ) : searchError ? (
              <Alert message={searchError} type="error" />
            ) : (
              <div>
                {selectedItem ? (
                  <LeadDetails
                    selectedItem={selectedItem}
                    handleEditLead={handleEditLead}
                    handleBackClick={handleBackClick}
                  />
                ) : selectedFilter ? (
                  <>
                    <Button
                      onClick={handleBackClick}
                      style={{ marginBottom: 16 }}
                    >
                      Back
                    </Button>
                    {leadsToDisplay.length > 0 ? (
                      <LeadCards
                        leadsToDisplay={leadsToDisplay}
                        selectedFilter={selectedFilter}
                        viewMode={viewMode}
                        handleCardClick={handleCardClick}
                        countCalls={countCalls}
                      />
                    ) : (
                      <Alert
                        message="No leads found for the selected filters and date range."
                        type="info"
                        showIcon
                      />
                    )}
                  </>
                ) : leadsToDisplay.length > 0 ? (
                  <LeadTable
                    leadsToDisplay={leadsToDisplay}
                    handleCardClick={handleCardClick}
                  />
                ) : (
                  <Alert
                    message="No leads found for the selected date range."
                    type="info"
                    showIcon
                  />
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