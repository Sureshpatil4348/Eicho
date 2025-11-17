/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpireCountdown, PaginationType } from "@renderer/types/helper.type";
import { useCallback, useEffect, useState } from "react";

export function debounce<T extends (...args: any[]) => void>(func: T, delay = 500): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function maskString(str: string, maskChar = '*'): string {
  return maskChar.repeat(str.length);
}

export function formatExpireCountdown(expireTime: string | number | Date): ExpireCountdown {
  const now = new Date();
  const expire = new Date(expireTime);
  const diff = expire.getTime() - now.getTime();

  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00', expired: true, }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number): string => (value > 9 ? `${value}` : `0${value}`);

  return { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds), expired: false };
}

export function useExpireCountdown(expireTime: string | number | Date): ExpireCountdown {
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const expire = new Date(expireTime);
    const diff = expire.getTime() - now.getTime();

    if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00', expired: true, }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (value: number): string => (value > 9 ? `${value}` : `0${value}`);

    return { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds), expired: false, };
  }, [expireTime]);

  const [timeLeft, setTimeLeft] = useState<ExpireCountdown>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft()
      setTimeLeft(timeLeft);
      if (timeLeft.expired) {
        clearInterval(timer)
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, expireTime]);

  return timeLeft;
}


export function formatNumber(value: string | number | bigint, style: keyof Intl.NumberFormatOptionsStyleRegistry): string {
  const format: Intl.NumberFormatOptions = { style: style }
  value = Number(value)

  if (format.style == "decimal") {
    format.maximumFractionDigits = 2;
  }

  if (format.style == "percent") {
    format.maximumFractionDigits = 2;
    // format.minimumFractionDigits = 2;
    // value = value / 100
  }

  if (format.style == "currency") {
    format.currency = "USD";
    format.maximumFractionDigits = 2;
    format.minimumFractionDigits = 2;
  }

  const formattedValue = new Intl.NumberFormat("en-US", format).format(value);
  return formattedValue;
}
export const sessionColors = ['#1E40AF', '#06B6D4', '#F59E0B', '#EC4899', '#10B981'];
export const currencyColors = ['#00D4AA', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6'];
export function pagination(limit: number, page: number, totalCount: number): PaginationType {
  return { limit, page, offset: limit * (page - 1), totalPages: Math.ceil(totalCount / limit), totalCount }
}
export const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state, // Keep existing state
        [action.payload.key]: action.payload.value // Update only the specified key
      };

    case 'MULTISET_STATE':
      return {
        ...state,
        ...(action.multiPayload ?? []).reduce((acc, { key, value }) => ({
          ...acc,
          [key]: value
        }), {})
      };

    case 'RESET_STATE':
      return {
        ...action.payload
      };

    default:
      return state;
  }
};
export const getPaginationRangeText = (pagination) => {
  const { page, limit, total } = pagination;
  const start = (page - 1) * limit + 1; // 1-based page index
  const end = Math.min(page * limit, total); // Never exceeds total
  return `${start}-${end} of ${total}`;
};
export const calculateDuration = (openTime, closeTime) => {
  if (!openTime || !closeTime) {
    return '--';
  }

  const start: any = new Date(openTime);
  const end: any = new Date(closeTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '--';
  }

  const diffMs = end - start;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  const seconds = diffSeconds % 60;

  if (hours === 0 && minutes === 0) {
    return `${seconds} sec`;
  }

  if (hours === 0) {
    return `${minutes} min ${seconds} sec`;
  }

  if (minutes === 0) {
    return `${hours} hr ${seconds} sec`;
  }

  if (seconds === 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${hours} hr ${minutes} min ${seconds} sec`;
};
export const dealTypeMap = {
  "DEAL_TYPE_BUY": "Buy",
  "DEAL_TYPE_SELL": "Sell",
  "DEAL_TYPE_BALANCE": "Balance",
  "DEAL_TYPE_CREDIT": "Credit",
  "DEAL_TYPE_CORRECTION": "Correction"
};
export const getTradeTypeClass = (type) => {
  if (type === "DEAL_TYPE_SELL") return "sell";
  if (type === "DEAL_TYPE_BALANCE") return "balance";
  if (type === "DEAL_TYPE_CREDIT") return "credit";
  if (type === "DEAL_TYPE_CORRECTION") return "correction";
  return "buy"; // Default for BUY and others
};
export const getScoreCategory = (score: any) => {
  if (score >= 800 && score <= 850) {
    return { label: 'Exceptional', color: '#10b981', bgColor: '#d1fae5' };
  }

  if (score >= 750 && score <= 799) {
    return { label: 'Expert', color: '#3b82f6', bgColor: '#dbeafe' };
  }

  if (score >= 700 && score <= 749) {
    return { label: 'Advanced', color: '#8b5cf6', bgColor: '#ede9fe' };
  }

  if (score >= 650 && score <= 699) {
    return { label: 'Intermediate', color: '#f59e0b', bgColor: '#fef3c7' };
  }

  if (score >= 600 && score <= 649) {
    return { label: 'Developing', color: '#f97316', bgColor: '#fed7aa' };
  }

  if (score >= 550 && score <= 599) {
    return { label: 'Beginner', color: '#ef4444', bgColor: '#fecaca' };
  }

  if (score >= 300 && score <= 549) {
    return { label: 'High Risk', color: '#dc2626', bgColor: '#fee2e2' };
  }

  // Handle edge cases
  return {
    label: 'Invalid Score',
    color: '#6b7280',
    bgColor: '#f3f4f6'
  };
};