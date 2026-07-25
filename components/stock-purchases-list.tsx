"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  approveStockPurchase,
  rejectStockPurchase,
  settleStockLiquidation,
  type AdminStockPurchase,
} from "@/app/actions/stock-purchases";
import { useRouter } from "next/navigation";

type TabKey = "pending" | "active" | "pending_liquidation" | "completed" | "all";

function userEmail(user: AdminStockPurchase["user"]) {
  if (typeof user === "string") return user;
  return user.email || user._id;
}

function formatMoney(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "-";
  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function StockPurchasesList({
  initialPurchases,
}: {
  initialPurchases: AdminStockPurchase[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("pending");
  const [purchases, setPurchases] = useState(initialPurchases);
  const [isPending, startTransition] = useTransition();
  const [settleTarget, setSettleTarget] = useState<AdminStockPurchase | null>(null);
  const [finalValue, setFinalValue] = useState("");
  const [isProfit, setIsProfit] = useState(true);

  const filtered = useMemo(() => {
    if (tab === "all") return purchases;
    return purchases.filter((p) => p.stock_status === tab);
  }, [purchases, tab]);

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const onApprove = (id: string) => {
    startTransition(async () => {
      const result = await approveStockPurchase(id);
      if (result.success) {
        toast.success(result.message);
        setPurchases((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, stock_status: "active" as const } : p
          )
        );
        refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const onReject = (id: string) => {
    startTransition(async () => {
      const result = await rejectStockPurchase(id);
      if (result.success) {
        toast.success(result.message);
        refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const openSettle = (purchase: AdminStockPurchase) => {
    setSettleTarget(purchase);
    const suggested =
      purchase.current_value ?? purchase.initial_investment ?? 0;
    setFinalValue(String(suggested));
    setIsProfit(suggested >= purchase.initial_investment);
  };

  const onSettle = () => {
    if (!settleTarget) return;
    const value = Number(finalValue);
    if (Number.isNaN(value) || value < 0) {
      toast.error("Enter a valid final value");
      return;
    }

    startTransition(async () => {
      const result = await settleStockLiquidation(settleTarget._id, {
        finalValue: value,
        isProfit,
      });
      if (result.success) {
        toast.success(result.message);
        setSettleTarget(null);
        refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "active", label: "Active" },
    { key: "pending_liquidation", label: "Liquidation" },
    { key: "completed", label: "Completed" },
    { key: "all", label: "All" },
  ];

  return (
    <>
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-500">Stock Purchases</CardTitle>
          <div className="flex flex-wrap gap-2 mt-4">
            {tabs.map((t) => (
              <Button
                key={t.key}
                size="sm"
                variant={tab === t.key ? "default" : "outline"}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No stock purchases in this tab</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Invested</TableHead>
                  <TableHead>Live Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((purchase) => (
                  <TableRow key={purchase._id}>
                    <TableCell className="text-sm">{userEmail(purchase.user)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{purchase.symbol}</div>
                      <div className="text-xs text-gray-400">{purchase.exchange}</div>
                    </TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>{formatMoney(purchase.initial_investment)}</TableCell>
                    <TableCell>
                      <div>{formatMoney(purchase.current_value)}</div>
                      <div className="text-xs text-gray-400">
                        @ {formatMoney(purchase.current_price)}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {purchase.stock_status.replace("_", " ")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {purchase.stock_status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              disabled={isPending}
                              onClick={() => onApprove(purchase._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isPending}
                              onClick={() => onReject(purchase._id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {purchase.stock_status === "pending_liquidation" && (
                          <>
                            <Button
                              size="sm"
                              disabled={isPending}
                              onClick={() => openSettle(purchase)}
                            >
                              Settle
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isPending}
                              onClick={() => onReject(purchase._id)}
                            >
                              Reject liq.
                            </Button>
                          </>
                        )}
                        {purchase.stock_status === "completed" && (
                          <span className="text-xs text-gray-400">
                            Final {formatMoney(purchase.admin_final_value)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!settleTarget} onOpenChange={(open) => !open && setSettleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Settle liquidation — {settleTarget?.symbol}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Live mark-to-market is a reference only. Set the final USDT payout
              the user will receive.
            </p>
            <div className="text-sm">
              Invested: {formatMoney(settleTarget?.initial_investment)} · Live:{" "}
              {formatMoney(settleTarget?.current_value)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalValue">Final value (USD / USDT)</Label>
              <Input
                id="finalValue"
                type="number"
                min="0"
                step="0.01"
                value={finalValue}
                onChange={(e) => {
                  setFinalValue(e.target.value);
                  const n = Number(e.target.value);
                  if (!Number.isNaN(n) && settleTarget) {
                    setIsProfit(n >= settleTarget.initial_investment);
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isProfit"
                type="checkbox"
                checked={isProfit}
                onChange={(e) => setIsProfit(e.target.checked)}
              />
              <Label htmlFor="isProfit">Mark as profit</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettleTarget(null)}>
              Cancel
            </Button>
            <Button disabled={isPending} onClick={onSettle}>
              Credit USDT & complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
