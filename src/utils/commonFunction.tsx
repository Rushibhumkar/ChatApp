import moment from 'moment';
import {myConsole} from './myConsole';
import {popUpConfToast} from './toastModalFunction';
import {Platform} from 'react-native';

export const getTextWithLength = (name: string, maxLength: number) => {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
};

export const capitalizeFirstLetter = (name: string): string => {
  if (!name || typeof name !== 'string') return ''; // Handle invalid input

  const words = name.trim().split(' ');

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  }

  const firstName =
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const lastName = words.slice(1).join(' ').toLowerCase();

  return `${firstName} ${lastName}`;
};
export const getTextWithLength2 = (name: string = '', maxLength: number) => {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
};

export const capitalizeFirstLetterWithSpace = (input: any): string => {
  if (!input) return '';
  const words = input
    .toString()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/\s+/);
  const formattedWords = words.map(
    word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
  return formattedWords.join(' ');
};

//example "2024-12-05T08:55:06.302Z"
export const formatDateAndTime = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${formattedDate}, ${formattedTime}`;
};

export const formatTime = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const convertToLowerCase = (input: any): string => {
  if (!input || typeof input !== 'string') return ''; // Handle invalid input
  return input.toLowerCase();
};

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const normalizeMobileNumber = (mobileNumber: string) => {
  let cleanedNumber = mobileNumber.replace(/[^\d+]/g, '');
  if (cleanedNumber.startsWith('+')) {
    return cleanedNumber;
  }
  if (mobileNumber.includes(' ')) {
    return `+${cleanedNumber}`;
  }
  return cleanedNumber;
};

export const getBracketValue = (input: string): string | null => {
  const match = input.match(/\(([^)]+)\)/);
  return match ? match[1].replace(/\s+/g, '') : null;
};

export const formatLowerCaseAllLetters = (input: string): string => {
  return input.toLowerCase();
};

export const lowercaseWithSpace = (input: string): string => {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Adds space before uppercase letters
    .toLowerCase(); // Converts the whole string to lowercase
};

export const formatTime24Hour = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`; // Returns in 24-hour format (HH:mm)
};

export const getLastSeen = (updatedAt: string): string => {
  if (typeof updatedAt !== 'string' || !updatedAt.trim()) {
    return 'Invalid input: Timestamp must be a non-empty string.';
  }

  const date = new Date(updatedAt);
  if (isNaN(date.getTime())) {
    return 'Invalid date format.';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'last seen just now';
  if (diffMinutes < 60) return `last seen ${diffMinutes} minute(s) ago`;
  if (diffHours < 24) {
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
    return `last seen at ${formattedTime}`;
  }
  if (diffDays === 1) return 'last seen yesterday';
  if (diffDays < 30) return `last seen ${diffDays} day(s) ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `last seen ${months} month(s) ago`;
  }

  const years = Math.floor(diffDays / 365);
  return `last seen ${years} year(s) ago`;
};

export const getValue = (primary: any, fallback: any, defaultVal = 'N/A') =>
  primary ?? fallback ?? defaultVal;
