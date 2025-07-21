/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpireCountdown, PaginationType } from "@renderer/interface/helper.interface";
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

export function pagination(limit: number, page: number, totalCount: number): PaginationType {
  return { limit, page, offset: limit * (page - 1), totalPages: Math.ceil(totalCount / limit), totalCount }
}
