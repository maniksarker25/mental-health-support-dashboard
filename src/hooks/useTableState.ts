import { useEffect, useState } from 'react';

export interface TableState {
  query: string;
  setQuery: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
}

export function useTableState(pageSize = 8): TableState {
  const [query, setQueryRaw] = useState('');
  const [page, setPage] = useState(1);

  const setQuery = (q: string) => {
    setQueryRaw(q);
    setPage(1);
  };

  return { query, setQuery, page, setPage, pageSize };
}

export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    totalPages,
    safePage,
    from: rows.length === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, rows.length),
    total: rows.length
  };
}

export function useSimulatedLoad(delay = 620): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return loading;
}