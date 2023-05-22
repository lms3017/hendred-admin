import { Timestamp } from 'firebase/firestore';

const getCurrentDate = () => {
  return Timestamp.now();
};

const formatDate = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}.${month}.${day}`;
  return formattedDate;
};

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const formattedDateTime = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};

export { getCurrentDate, formatDate, formatDateTime };
