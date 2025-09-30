"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import {
  getCryptoOptions,
  createCryptoOption,
  deleteCryptoOption,
  updateCryptoOption,
  type CryptoOption,
  type CreateCryptoOptionRequest,
} from "@/app/actions/crypto";
import { DeleteCryptoDialog, EditCryptoDialog } from "@/components/crypto-dialog";



export default function CryptocurrenciesTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoOption[]>([]);
  const [newCrypto, setNewCrypto] = useState<Partial<CreateCryptoOptionRequest>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCrypto, setEditingCrypto] = useState<CryptoOption | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchCryptocurrencies = async () => {
    setIsLoading(true);
    try {
      const response = await getCryptoOptions();
      if (response.success) {
        setCryptocurrencies(response.data);
      } else {
        toast.error("Error", {
          description: response.message || "Failed to fetch cryptocurrencies.",
        });
      }
    } catch (error) {
      console.error("Error fetching cryptocurrencies:", error);
      toast.error("Error", {
        description: "Failed to fetch cryptocurrencies.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCrypto = async () => {
    if (!newCrypto.token_name || !newCrypto.token_symbol || !newCrypto.token_address) {
      toast.error("Error", {
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await createCryptoOption({
        token_name: newCrypto.token_name,
        token_symbol: newCrypto.token_symbol,
        token_address: newCrypto.token_address,
      });

      if (response.success) {
        setNewCrypto({});
        setIsAddDialogOpen(false);
        await fetchCryptocurrencies(); // Refetch data
        toast.success("Success", {
          description: "Cryptocurrency added successfully!",
        });
      } else {
        toast.error("Error", {
          description: response.message || "Failed to add cryptocurrency.",
        });
      }
    } catch (error) {
      console.error("Error adding cryptocurrency:", error);
      toast.error("Error", {
        description: "Failed to add cryptocurrency.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveCrypto = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await deleteCryptoOption(id);
      
      if (response.success) {
        await fetchCryptocurrencies(); // Refetch data
        toast.success("Success", {
          description: "Cryptocurrency deleted successfully!",
        });
      } else {
        toast.error("Error", {
          description: response.message || "Failed to delete cryptocurrency.",
        });
      }
    } catch (error) {
      console.error("Error deleting cryptocurrency:", error);
      toast.error("Error", {
        description: "Failed to delete cryptocurrency.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCrypto = async () => {
    if (!editingCrypto) return;

    setIsLoading(true);
    try {
      const response = await updateCryptoOption(editingCrypto._id, {
        token_name: editingCrypto.token_name,
        token_symbol: editingCrypto.token_symbol,
        token_address: editingCrypto.token_address,
      });

      if (response.success) {
        setEditingCrypto(null);
        setIsEditDialogOpen(false);
        await fetchCryptocurrencies(); // Refetch data
        toast.success("Success", {
          description: "Cryptocurrency updated successfully!",
        });
      } else {
        toast.error("Error", {
          description: response.message || "Failed to update cryptocurrency.",
        });
      }
    } catch (error) {
      console.error("Error updating cryptocurrency:", error);
      toast.error("Error", {
        description: "Failed to update cryptocurrency.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptocurrencies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-lg md:text-2xl font-bold mb-5">
        Manage Cryptocurrencies
      </h1>
      <div className="mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-app-gold-100 hover:bg-app-gold-200 text-black">
              <Plus className="mr-2 h-4 w-4" /> Add Cryptocurrency
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cryptocurrency</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCrypto.token_name || ""}
                  onChange={(e) =>
                    setNewCrypto({
                      ...newCrypto,
                      token_name: e.target.value,
                    })
                  }
                  className="col-span-3 text-white"
                  placeholder="e.g., Bitcoin"
                  disabled={isCreating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="symbol" className="text-right">
                  Symbol
                </Label>
                <Input
                  id="symbol"
                  value={newCrypto.token_symbol || ""}
                  onChange={(e) =>
                    setNewCrypto({
                      ...newCrypto,
                      token_symbol: e.target.value.toUpperCase(),
                    })
                  }
                  className="col-span-3 text-white"
                  placeholder="e.g., BTC"
                  disabled={isCreating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="walletAddress" className="text-right">
                  Wallet Address
                </Label>
                <Input
                  id="walletAddress"
                  value={newCrypto.token_address || ""}
                  onChange={(e) =>
                    setNewCrypto({
                      ...newCrypto,
                      token_address: e.target.value,
                    })
                  }
                  className="col-span-3 text-white"
                  placeholder="Enter wallet address"
                  disabled={isCreating}
                />
              </div>
            </div>
            <Button disabled={isCreating} onClick={handleAddCrypto}>
              {isCreating ? "Adding Cryptocurrency..." : "Add Cryptocurrency"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Symbol</TableHead>
              <TableHead className="text-white">Wallet Address</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptocurrencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No cryptocurrencies found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              cryptocurrencies.map((crypto) => (
                <TableRow key={crypto._id}>
                  <TableCell className="text-white">{crypto.token_name}</TableCell>
                  <TableCell className="font-mono font-semibold text-white">{crypto.token_symbol}</TableCell>
                  <TableCell className="font-mono max-w-44 truncate text-white">
                    {crypto.token_address}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <EditCryptoDialog
                          crypto={crypto}
                          isEditDialogOpen={isEditDialogOpen}
                          setIsEditDialogOpen={setIsEditDialogOpen}
                          editingCrypto={editingCrypto}
                          setEditingCrypto={setEditingCrypto}
                          isLoading={isLoading}
                          handleEditCrypto={handleEditCrypto}
                      />
                      <DeleteCryptoDialog
                          cryptoId={crypto._id}
                          isLoading={isLoading}
                          handleRemoveCrypto={handleRemoveCrypto}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

