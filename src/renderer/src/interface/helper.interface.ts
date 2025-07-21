export interface ExpireCountdown {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    expired: boolean;
};

export interface PaginationType {
  limit: number;
  page: number;
  offset: number;
  totalPages: number;
  totalCount: number;
}
