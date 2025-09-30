import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CryptoOption } from "@/app/actions/crypto"
import { useState } from "react"

interface DeleteCryptoDialogProps {
    cryptoId: string;
    isLoading: boolean;
    handleRemoveCrypto: (id: string) => void;
}


interface EditCryptoDialogProps {
    crypto: CryptoOption
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    editingCrypto: CryptoOption | null
    setEditingCrypto: (crypto: CryptoOption) => void
    isLoading: boolean
    handleEditCrypto: () => void
}


export function DeleteCryptoDialog({ cryptoId, isLoading, handleRemoveCrypto }: DeleteCryptoDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        handleRemoveCrypto(cryptoId);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="cursor-pointer" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete the cryptocurrency from the system.
                    </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? "Removing token..." : "Remove Token"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}



export function EditCryptoDialog({ 
    crypto, 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    editingCrypto, 
    setEditingCrypto, 
    isLoading, 
    handleEditCrypto 
}: EditCryptoDialogProps) {
    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer" size="sm" onClick={() => setEditingCrypto(crypto)}>
                    <Pencil className="h-4 w-4 text-white" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Cryptocurrency</DialogTitle>
                </DialogHeader>
                {editingCrypto && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Token Name</Label>
                            <Input
                                id="edit-name"
                                value={editingCrypto.token_name || ""}
                                onChange={(e) => setEditingCrypto({ ...editingCrypto, token_name: e.target.value })}
                                className="col-span-3 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-symbol" className="text-right">Token Symbol</Label>
                            <Input
                                id="edit-symbol"
                                value={editingCrypto.token_symbol}
                                onChange={(e) => setEditingCrypto({ ...editingCrypto, token_symbol: e.target.value.toUpperCase() })}
                                className="col-span-3 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-walletAddress" className="text-right">Wallet Address</Label>
                            <Input
                                id="edit-walletAddress"
                                value={editingCrypto.token_address}
                                onChange={(e) => setEditingCrypto({ ...editingCrypto, token_address: e.target.value })}
                                className="col-span-3 text-white"
                            />
                        </div>
                    </div>
                )}
                <Button disabled={isLoading} onClick={handleEditCrypto}>
                    {isLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}