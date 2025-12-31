"use client";

import { useCustomers } from "@/hooks/firestore/use-customers";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Plus, Users, Building2, User, Mail, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { CustomerDialog } from "@/components/admin/customers/customer-dialog";
import { GradientListItem } from "@/components/ui/gradient-list-item";
import { updateDocument } from "@/services/firebase/database";
import { Customer } from "@/types/firestore";

export default function AdminCustomersPage() {
    const { customers, loading, addCustomer, deleteCustomer } = useCustomers();
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSave = async (data: any) => {
        if (editingCustomer) {
            // @ts-ignore
            await updateDocument("customers", editingCustomer.id, data);
        } else {
            await addCustomer(data);
        }
        setIsDialogOpen(false);
        setEditingCustomer(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            await deleteCustomer(id);
        }
    };

    const openNew = () => {
        setEditingCustomer(null);
        setIsDialogOpen(true);
    };

    const openEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6 min-h-screen">
            <CustomerDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                customer={editingCustomer}
                onSubmit={handleSave}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Customers</h1>
                    <p className="text-muted-foreground mt-1">Manage your client roster and organizations.</p>
                </div>
                <Button
                    onClick={openNew}
                    className="bg-[#bef264] text-black hover:bg-[#a3e635] shadow-[0_0_15px_rgba(190,242,100,0.3)]"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-[#bef264]/50"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#bef264]" />
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="text-center p-16 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Users className="w-8 h-8 text-white/20" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">No customers found</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                                {searchQuery ? "Try adjusting your search terms." : "Get started by adding your first customer to the database."}
                            </p>
                        </div>
                        {!searchQuery && (
                            <Button variant="outline" onClick={openNew} className="border-white/10 text-white hover:bg-white/5 mt-4">
                                <Plus className="mr-2 h-4 w-4" /> Add New Customer
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredCustomers.map((customer) => (
                            <GradientListItem
                                key={customer.id}
                                variant={customer.type === 'company' ? 'blue' : 'purple'}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${customer.type === 'company' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                        {customer.type === 'company' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{customer.name}</h3>
                                        {customer.type === 'company' && <p className="text-muted-foreground text-sm">{customer.companyName}</p>}
                                        <p className="text-xs text-muted-foreground/60">{customer.contactEmail}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mr-4">
                                    <div className="hidden md:block text-right">
                                        <div className="text-xs text-muted-foreground uppercase">Status</div>
                                        <div className={`font-medium capitalize ${customer.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>{customer.status}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/admin/customers/${customer.id}`}>
                                            <Button variant="ghost" size="icon" className="hover:text-blue-400">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(customer)} className="hover:text-[#bef264]">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)} className="hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </GradientListItem>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
