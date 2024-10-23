// utils.js
import dayjs from 'dayjs';

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export const capitalizeStatus = (status) => {
  return status
    ?.toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
