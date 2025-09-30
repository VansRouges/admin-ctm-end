import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { CreateCopyTradeOptionRequest } from "@/app/actions/copytrade";

interface TradeFormProps {
    isLoading: boolean;
    onSubmit: (trader: CreateCopyTradeOptionRequest) => void;
}
  
export function TraderForm({ onSubmit, isLoading }: TradeFormProps) {
    const [formData, setFormData] = useState<CreateCopyTradeOptionRequest>({
      trade_title: "",
      trade_description: "",
      trade_risk: "",
      trade_min: 0,
      trade_max: 0,
      trade_duration: 1,
      trade_roi_min: 0,
      trade_roi_max: 0,
      isRecommended: false,
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
  
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked :
          name === "trade_title" || name === "trade_description" || name === "trade_risk"
            ? value
            : parseFloat(value) || 0, // Default to 0 if parsing fails for numeric fields
      }));
    };
  
    const handleSelectChange = (value: string) => {
      setFormData((prev) => ({
        ...prev,
        trade_risk: value, // Set the trade_risk field based on the selected value
      }));
    };

    const handleRecommendedChange = (checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        isRecommended: checked,
      }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="trade_title" className="text-white font-medium">Trade Title</Label>
          <Input
            type="text"
            id="trade_title"
            name="trade_title"
            value={formData.trade_title}
            onChange={handleChange}
            className="border-gray-600 bg-gray-800 text-white"
            placeholder="e.g., Aggressive Alpha Bot"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="trade_description" className="text-white font-medium">Trade Description</Label>
          <Input
            type="text"
            id="trade_description"
            name="trade_description"
            value={formData.trade_description}
            onChange={handleChange}
            className="border-gray-600 bg-gray-800 text-white"
            placeholder="High-frequency trading bot..."
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="trade_risk" className="text-white font-medium">Trade Risk</Label>
          <Select
            onValueChange={handleSelectChange}
            value={formData.trade_risk}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select trade risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center">
                  Low
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center">
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center">
                  High
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="trade_min" className="text-white font-medium">Trade Min ($)</Label>
          <Input
            type="number"
            id="trade_min"
            name="trade_min"
            value={formData.trade_min}
            onChange={handleChange}
            className="border-gray-600 bg-gray-800 text-white"
            min="0"
            max="100000000000000"
            step="0.1"
            placeholder="1000"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="trade_max" className="text-white font-medium">Trade Max ($)</Label>
          <Input
            type="number"
            id="trade_max"
            name="trade_max"
            value={formData.trade_max}
            onChange={handleChange}
            className="border-gray-600 bg-gray-800 text-white"
            min="0"
            max="100000000000000"
            step="0.1"
            placeholder="50000"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="trade_roi_min" className="text-white font-medium">Trade ROI Min (%)</Label>
          <Input
            type="number"
            id="trade_roi_min"
            name="trade_roi_min"
            value={formData.trade_roi_min}
            onChange={handleChange}
            className="border-gray-600 bg-gray-800 text-white"
            min="0"
            placeholder="20"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="trade_roi_max" className="text-white font-medium">Trade ROI Max (%)</Label>
          <Input
            type="number"
            id="trade_roi_max"
            name="trade_roi_max"
            value={formData.trade_roi_max}
            onChange={handleChange}
            className="border-gray-600 bg-gray-800 text-white"
            min="0"
            placeholder="45"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="trade_duration" className="text-white font-medium">Trade Duration (Days)</Label>
          <Input
            type="number"
            id="trade_duration"
            name="trade_duration"
            value={formData.trade_duration}
            onChange={handleChange}
            className="border-gray-600 bg-gray-800 text-white"
            min="1"
            placeholder="90"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRecommended"
            checked={formData.isRecommended}
            onCheckedChange={handleRecommendedChange}
          />
          <Label htmlFor="isRecommended" className="text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Mark as Recommended Trading Option
          </Label>
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="bg-app-gold-100 hover:bg-app-gold-200 text-black"
        >
          {isLoading ? "Adding Trade..." : "Add Trade"}
        </Button>
      </form>
    );
  }