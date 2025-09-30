"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { TraderForm } from "@/components/admin-copytrades-form";
import { DeleteTradeDialog, EditTradeDialog } from "@/components/admin-editcopytrades-form";
import { truncateText, formatCurrency } from "@/lib/utils";
import {
  getCopyTradeOptions,
  createCopyTradeOption,
  updateCopyTradeOption,
  deleteCopyTradeOption,
  type CopyTradeOption,
  type CreateCopyTradeOptionRequest,
} from "@/app/actions/copytrade";

export default function AdminCopyTrading() {
  const [trades, setTrades] = useState<CopyTradeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTrades, setEditingTrades] = useState<CopyTradeOption | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getCopyTradeOptions();
      if (response.success) {
        setTrades(response.data);
      } else {
        toast.error("Error", {
          description: response.message || "Failed to fetch copy trade options.",
        });
      }
    } catch (error) {
      console.error('Error fetching copy trade options:', error);
      toast.error("Error", {
        description: "Failed to fetch copy trade options.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch traders from API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTrade = async (newTrade: CreateCopyTradeOptionRequest) => {
    setIsCreating(true);
    try {
      const response = await createCopyTradeOption(newTrade);

      if (response.success) {
        setIsAddDialogOpen(false);
        await fetchData(); // Refetch data
        toast.success("Success", {
          description: "Copy trade option added successfully!",
        });
      } else {
        toast.error("Error", {
          description: response.message || "Failed to add copy trade option.",
        });
      }
    } catch (error) {
      console.error("Error adding copy trade option:", error);
      toast.error("Error", {
        description: "Failed to add copy trade option.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTrades = async (updatedTrade: CopyTradeOption) => {
    setIsLoading(true);
    try {
      const response = await updateCopyTradeOption(updatedTrade._id, {
        trade_title: updatedTrade.trade_title,
        trade_description: updatedTrade.trade_description,
        trade_risk: updatedTrade.trade_risk,
        trade_min: updatedTrade.trade_min,
        trade_max: updatedTrade.trade_max,
        trade_roi_min: updatedTrade.trade_roi_min,
        trade_roi_max: updatedTrade.trade_roi_max,
        trade_duration: updatedTrade.trade_duration,
        isRecommended: updatedTrade.isRecommended,
      });

      if (response.success) {
        setEditingTrades(null);
        setIsEditDialogOpen(false);
        await fetchData(); // Refetch data
        toast.success("Success", {
          description: "Copy trade option updated successfully!",
        });
      } else {
        toast.error("Error", {
          description: response.message || "Failed to update copy trade option.",
        });
      }
    } catch (error) {
      console.error("Error updating copy trade option:", error);
      toast.error("Error", {
        description: "Failed to update copy trade option.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTrade = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await deleteCopyTradeOption(id);

      if (response.success) {
        await fetchData(); // Refetch data
        toast.success("Success", {
          description: "Copy trade option deleted successfully!",
        });
      } else {
        toast.error("Error", {
          description: response.message || "Failed to delete copy trade option.",
        });
      }
    } catch (error) {
      console.error("Error deleting copy trade option:", error);
      toast.error("Error", {
        description: "Failed to delete copy trade option.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl font-bold text-white">
          Manage Copy Trading Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-app-gold-100 hover:bg-app-gold-200 text-black">
                <Plus className="mr-2 h-4 w-4" /> Add Trade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-white">Add New Copy Trade Option</DialogTitle>
              </DialogHeader>
              <TraderForm isLoading={isCreating} onSubmit={handleAddTrade} />
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <DataTableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Trade</TableHead>
                <TableHead className="text-white">Trade Desc.</TableHead>
                <TableHead className="text-white">Trade Risk</TableHead>
                <TableHead className="text-white">Trade Min</TableHead>
                <TableHead className="text-white">Trade Max</TableHead>
                <TableHead className="text-white">Trade ROI Min(%)</TableHead>
                <TableHead className="text-white">Trade ROI Max(%)</TableHead>
                <TableHead className="text-white">Trade Duration</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No copy trade options found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                trades.map((trade) => (
                  <TableRow key={trade._id}>
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        {truncateText(trade.trade_title, 15)}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{truncateText(trade.trade_description, 20)}</TableCell>
                    <TableCell className="text-white capitalize">{trade.trade_risk}</TableCell>
                    <TableCell className="text-white">{formatCurrency(trade.trade_min)}</TableCell>
                    <TableCell className="text-white">{formatCurrency(trade.trade_max)}</TableCell>
                    <TableCell className="text-white">{trade.trade_roi_min}%</TableCell>
                    <TableCell className="text-white">{trade.trade_roi_max}%</TableCell>
                    <TableCell className="text-white">{trade.trade_duration} days</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <EditTradeDialog
                          isLoading={isLoading}
                          trades={trade}
                          isEditDialogOpen={isEditDialogOpen}
                          setIsEditDialogOpen={setIsEditDialogOpen}
                          editingTrades={editingTrades}
                          setEditingTrades={setEditingTrades}
                          handleEditTrades={handleEditTrades}
                        />
                        <DeleteTradeDialog
                          tradeId={trade._id}
                          isLoading={isLoading}
                          handleDeleteTrade={handleDeleteTrade}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

