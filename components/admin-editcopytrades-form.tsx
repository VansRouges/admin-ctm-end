import { Pencil } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CopyTradeOption } from "@/app/actions/copytrade";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface DeleteTradeDialogProps {
    tradeId: string;
    isLoading: boolean;
    handleDeleteTrade: (id: string) => void;
}

interface EditCryptoDialogProps {
    trades: CopyTradeOption
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    editingTrades: CopyTradeOption | null
    setEditingTrades: (crypto: CopyTradeOption) => void
    isLoading: boolean
    handleEditTrades: (updatedTrade: CopyTradeOption) => Promise<void>;
}

export function DeleteTradeDialog({ tradeId, isLoading, handleDeleteTrade }: DeleteTradeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        handleDeleteTrade(tradeId);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-white">Are you sure?</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete the copy trade option from the system.
                    </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsOpen(false)} 
                        disabled={isLoading}
                        className="border-app-gold-100 text-white hover:bg-yellow-600 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete} 
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white border border-red-500"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export function EditTradeDialog({ 
    trades, 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    editingTrades, 
    setEditingTrades, 
    isLoading, 
    handleEditTrades
 }: EditCryptoDialogProps) {
    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingTrades(trades)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Copy Trade Option</DialogTitle>
                </DialogHeader>
                {editingTrades && (
                    <div className="grid gap-4 py-4">
                        {/* Trade Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trade_title" className="text-right text-white font-medium">Trade Title</Label>
                            <Input
                                id="trade_title"
                                value={editingTrades.trade_title || ""}
                                onChange={(e) => setEditingTrades({ 
                                    ...editingTrades, 
                                    trade_title: e.target.value 
                                })}
                                className="col-span-3 text-white border-gray-600 bg-gray-800"
                                placeholder="Enter trade title"
                            />
                        </div>

                        {/* Trade Description */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trade_description" className="text-right text-white font-medium">Description</Label>
                            <Input
                                id="trade_description"
                                name="trade_description"
                                value={editingTrades.trade_description || ""}
                                onChange={(e) => setEditingTrades({ 
                                    ...editingTrades, 
                                    trade_description: e.target.value 
                                })}
                                className="col-span-3 text-white border-gray-600 bg-gray-800"
                                placeholder="Enter trade description"
                            />
                        </div>

                        {/* Trade Risk */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trade_risk" className="text-right text-white font-medium">Risk Level</Label>
                            <Select
                                value={editingTrades.trade_risk || ""}
                                onValueChange={(value) => setEditingTrades({ 
                                    ...editingTrades, 
                                    trade_risk: value 
                                })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Risk Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Trade Min */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trade_min" className="text-right text-white font-medium">Min Amount ($)</Label>
                            <Input
                                id="trade_min"
                                type="number"
                                name="trade_min"
                                min="0"
                                placeholder="Enter minimum trade amount"
                                value={editingTrades.trade_min || ""}
                                onChange={(e) => setEditingTrades({ 
                                    ...editingTrades, 
                                    trade_min: Number(e.target.value) 
                                })}
                                className="col-span-3 border-gray-600 bg-gray-800 text-white"
                            />
                        </div>

                        {/* Trade Max */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trade_max" className="text-right text-white font-medium">Max Amount ($)</Label>
                            <Input
                                id="trade_max"
                                type="number"
                                name="trade_max"
                                min="0"
                                placeholder="Enter maximum trade amount"
                                value={editingTrades.trade_max || ""}
                                onChange={(e) => setEditingTrades({ 
                                    ...editingTrades, 
                                    trade_max: Number(e.target.value) 
                                })}
                                className="col-span-3 border-gray-600 bg-gray-800 text-white"
                            />
                        </div>

                        {/* Trade ROI Min */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trade_roi_min" className="text-right text-white font-medium">ROI Min (%)</Label>
                            <Input
                                id="trade_roi_min"
                                type="number"
                                name="trade_roi_min"
                                min="0"
                                placeholder="Enter minimum ROI percentage"
                                value={editingTrades.trade_roi_min || ""}
                                onChange={(e) => setEditingTrades({ 
                                    ...editingTrades, 
                                    trade_roi_min: Number(e.target.value) 
                                })}
                                className="col-span-3 border-gray-600 bg-gray-800 text-white"
                            />
                        </div>

                        {/* Trade ROI Max */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trade_roi_max" className="text-right text-white font-medium">ROI Max (%)</Label>
                            <Input
                                id="trade_roi_max"
                                type="number"
                                name="trade_roi_max"
                                min="0"
                                placeholder="Enter maximum ROI percentage"
                                value={editingTrades.trade_roi_max || ""}
                                onChange={(e) => setEditingTrades({ 
                                    ...editingTrades, 
                                    trade_roi_max: Number(e.target.value) 
                                })}
                                className="col-span-3 border-gray-600 bg-gray-800 text-white"
                            />
                        </div>

                        {/* Trade Duration */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trade_duration" className="text-right text-white font-medium">Duration (Days)</Label>
                            <Input
                                id="trade_duration"
                                type="number"
                                name="trade_duration"
                                min="1"
                                placeholder="Enter trade duration in days"
                                value={editingTrades.trade_duration || ""}
                                onChange={(e) => setEditingTrades({ 
                                    ...editingTrades, 
                                    trade_duration: Number(e.target.value) 
                                })}
                                className="col-span-3 border-gray-600 bg-gray-800 text-white"
                            />
                        </div>

                        {/* Is Recommended */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isRecommended"
                                checked={editingTrades.isRecommended}
                                onCheckedChange={(checked: boolean) => setEditingTrades({ 
                                    ...editingTrades, 
                                    isRecommended: checked 
                                })}
                            />
                            <Label htmlFor="isRecommended" className="text-white font-medium leading-none">
                                Mark as Recommended Trading Option
                            </Label>
                        </div>
                    </div>
                )}
                <Button 
                    disabled={isLoading} 
                    onClick={() => editingTrades && handleEditTrades(editingTrades)}
                >
                    {isLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}

