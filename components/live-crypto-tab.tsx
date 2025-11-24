"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLiveCryptoPrices, type LiveCryptoPrice } from "@/app/actions/live-crypto";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconChevronDown, IconChevronsRight } from "@tabler/icons-react";

export default function LiveCryptoTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allPrices, setAllPrices] = useState<LiveCryptoPrice[]>([]);
  const [meta, setMeta] = useState<{ count?: number; cached?: boolean }>({});
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchLiveCryptoPrices();
      if (!res.success) throw new Error(res.message || "Failed to load prices");
      setAllPrices(res.data || []);
      setMeta({ count: res.count, cached: res.cached });
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to load prices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    // Reset to first page on search change
    setPageIndex(0);
  }, [search, pageSize]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allPrices;
    return allPrices.filter((p) => p.token.toLowerCase().includes(q));
  }, [allPrices, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const pageItems = filtered.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  if (loading) return <DataTableSkeleton />;
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Failed to load prices</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-app-gold-100 hover:bg-app-gold-200 text-black">Reload</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Live Crypto Prices</h2>
          <p className="text-sm text-gray-400 mt-1">Realtime token/USD prices from backend</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{backgroundColor: meta.cached ? '#22c55e' : '#eab308'}} />
              {meta.cached ? 'Cached' : 'Fresh'} data
            </span>
            {typeof meta.count === 'number' && (
              <span>{meta.count} tokens</span>
            )}
            {lastUpdated && (
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Label htmlFor="rows" className="text-white">Rows</Label>
            <select
              id="rows"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
            >
              {[10, 20, 30, 40, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="search" className="text-white">Search</Label>
            <Input id="search" placeholder="Search token (e.g., BTC)" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          </div>
          <Button onClick={load} disabled={loading} className="bg-app-gold-100 hover:bg-app-gold-200 text-black">
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border px-4 lg:px-6">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-white">Token</TableHead>
              <TableHead className="text-white text-right">Price (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-white">No results.</TableCell>
              </TableRow>
            ) : (
              pageItems.map((p, i) => (
                <TableRow
                  key={p.token}
                  className={`${i % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/40 border-gray-800`}
                >
                  <TableCell className="text-white">
                    <span className="inline-flex items-center rounded-md bg-gray-800 px-2 py-1 font-mono font-semibold">
                      {p.token}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-white">
                    {p.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="text-white text-sm">Page {currentPage + 1} of {pageCount}</div>
        <div className="flex items-center gap-2">
          <Button
            className="hidden h-8 w-8 p-0 lg:flex bg-app-gold-100 hover:bg-app-gold-200 text-black"
            onClick={() => setPageIndex(0)}
            disabled={currentPage === 0}
          >
            <span className="sr-only">First</span>
            <IconChevronDown className="rotate-90" />
          </Button>
          <Button
            className="size-8 bg-app-gold-100 hover:bg-app-gold-200 text-black"
            onClick={() => setPageIndex(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <span className="sr-only">Prev</span>
            <IconChevronDown className="rotate-90" />
          </Button>
          <Button
            className="size-8 bg-app-gold-100 hover:bg-app-gold-200 text-black"
            onClick={() => setPageIndex(Math.min(pageCount - 1, currentPage + 1))}
            disabled={currentPage >= pageCount - 1}
          >
            <span className="sr-only">Next</span>
            <IconChevronDown className="-rotate-90" />
          </Button>
          <Button
            className="hidden size-8 lg:flex bg-app-gold-100 hover:bg-app-gold-200 text-black"
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={currentPage >= pageCount - 1}
          >
            <span className="sr-only">Last</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}


