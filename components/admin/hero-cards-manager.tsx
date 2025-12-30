"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, setDoc, addDoc } from "firebase/firestore";
import { HeroCard } from "@/types/hero-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit2, Plus, GripVertical } from "lucide-react";

export function HeroCardsManager() {
    const [cards, setCards] = useState<HeroCard[]>([]);
    const [editingCard, setEditingCard] = useState<HeroCard | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "hero_cards"), orderBy("order", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroCard));
            setCards(data);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this card?")) {
            await deleteDoc(doc(db, "hero_cards", id));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCard) return;

        try {
            if (editingCard.id) {
                // Update existing
                await setDoc(doc(db, "hero_cards", editingCard.id), editingCard);
            } else {
                // Add new (auto-id)
                const newRef = doc(collection(db, "hero_cards"));
                await setDoc(newRef, { ...editingCard, id: newRef.id });
            }
            setIsDialogOpen(false);
            setEditingCard(null);
        } catch (error) {
            console.error("Error saving card:", error);
        }
    };

    const openNewCard = () => {
        setEditingCard({
            id: "",
            title: "",
            description: "",
            modalContent: "",
            order: cards.length + 1,
            subtitle: "",
            color: "bg-blue-500"
        });
        setIsDialogOpen(true);
    };

    const openEditCard = (card: HeroCard) => {
        setEditingCard(card);
        setIsDialogOpen(true);
    };


    const PRESET_IMAGES = [
        { label: "Web Platforms", value: "/assets/images/hero_cards/web-platforms.png" },
        { label: "Mobile Apps", value: "/assets/images/hero_cards/mobile-apps.png" },
        { label: "Consulting", value: "/assets/images/hero_cards/consulting.png" },
        { label: "Trainings", value: "/assets/images/hero_cards/trainings.png" },
        { label: "AI Engineering", value: "/assets/images/hero_cards/ai-engineering.png" }
    ];

    return (
        <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Hero 3D Cards</h2>
                    <p className="text-sm text-gray-400">Manage the interactive cards displayed on the home page.</p>
                </div>
                <Button onClick={openNewCard} className="bg-nyembo-sky text-black hover:bg-cyan-400">
                    <Plus className="w-4 h-4 mr-2" /> Add Card
                </Button>
            </div>

            <div className="grid gap-4">
                {cards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <GripVertical className="text-gray-600 cursor-move" />
                            {card.imageUrl ? (
                                <img src={card.imageUrl} alt={card.title} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                            ) : (
                                <div className={`w-3 h-12 rounded-full ${card.color || 'bg-gray-500'}`} />
                            )}
                            <div>
                                <h3 className="font-bold text-white">{card.title}</h3>
                                <p className="text-xs text-gray-400">{card.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="hover:text-nyembo-sky" onClick={() => openEditCard(card)}>
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:text-red-500" onClick={() => handleDelete(card.id!)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#1a1a1f] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">{editingCard?.id ? "Edit Card" : "New Card"}</h2>
                    {editingCard && (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-gray-500">Title</label>
                                    <Input
                                        value={editingCard.title}
                                        onChange={e => setEditingCard({ ...editingCard, title: e.target.value })}
                                        className="bg-black/50 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-gray-500">Subtitle</label>
                                    <Input
                                        value={editingCard.subtitle}
                                        onChange={e => setEditingCard({ ...editingCard, subtitle: e.target.value })}
                                        className="bg-black/50 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-gray-500">Card Image</label>
                                <div className="grid grid-cols-5 gap-2 mb-2">
                                    {PRESET_IMAGES.map((img) => (
                                        <button
                                            key={img.value}
                                            type="button"
                                            onClick={() => setEditingCard({ ...editingCard, imageUrl: img.value })}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${editingCard.imageUrl === img.value ? 'border-nyembo-sky opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            title={img.label}
                                        >
                                            <img src={img.value} alt={img.label} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                                <Input
                                    value={editingCard.imageUrl || ""}
                                    onChange={e => setEditingCard({ ...editingCard, imageUrl: e.target.value })}
                                    placeholder="Enter image URL or select above"
                                    className="bg-black/50 border-white/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-gray-500">Short Description</label>
                                <Textarea
                                    value={editingCard.description}
                                    onChange={e => setEditingCard({ ...editingCard, description: e.target.value })}
                                    className="bg-black/50 border-white/10 h-20"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-gray-500">Modal Content (HTML)</label>
                                <Textarea
                                    value={editingCard.modalContent}
                                    onChange={e => setEditingCard({ ...editingCard, modalContent: e.target.value })}
                                    className="bg-black/50 border-white/10 font-mono text-xs h-32"
                                    required
                                />
                                <p className="text-[10px] text-gray-500">Supports basic HTML tags.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-gray-500">Color Class</label>
                                    <Input
                                        value={editingCard.color}
                                        onChange={e => setEditingCard({ ...editingCard, color: e.target.value })}
                                        className="bg-black/50 border-white/10"
                                        placeholder="bg-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-gray-500">Order</label>
                                    <Input
                                        type="number"
                                        value={editingCard.order}
                                        onChange={e => setEditingCard({ ...editingCard, order: parseInt(e.target.value) })}
                                        className="bg-black/50 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                                <div className="flex gap-4 items-center">
                                    {editingCard.imageUrl && (
                                        <img src={editingCard.imageUrl} alt="Preview" className="w-16 h-16 rounded-md object-cover border border-white/10" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-bold">{editingCard.title || "Card Title"}</p>
                                        <p className="text-xs text-gray-400">{editingCard.subtitle || "Subtitle"}</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full ${editingCard.color}`} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-nyembo-sky text-black hover:bg-cyan-400">Save Changes</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
