/**
 * useKanban Hook
 * 
 * Encapsulates kanban board logic including drag-and-drop state management,
 * column management, and item reordering.
 */

import { useState, useCallback, useMemo } from 'react';

export interface KanbanItem {
    id: string;
    title: string;
    columnId: string;
    order: number;
    [key: string]: unknown;
}

export interface KanbanColumn {
    id: string;
    title: string;
    color?: string;
    limit?: number; // WIP limit
}

export interface UseKanbanOptions<T extends KanbanItem> {
    initialItems: T[];
    columns: KanbanColumn[];
    onItemMove?: (item: T, fromColumn: string, toColumn: string) => Promise<void>;
    onItemReorder?: (item: T, newOrder: number) => Promise<void>;
}

export interface UseKanbanReturn<T extends KanbanItem> {
    items: T[];
    columns: KanbanColumn[];
    getColumnItems: (columnId: string) => T[];
    moveItem: (itemId: string, toColumnId: string) => void;
    reorderItem: (itemId: string, newOrder: number) => void;
    addItem: (item: T) => void;
    removeItem: (itemId: string) => void;
    updateItem: (itemId: string, updates: Partial<T>) => void;
    isDragging: boolean;
    setDragging: (dragging: boolean) => void;
    draggedItem: T | null;
    setDraggedItem: (item: T | null) => void;
    getColumnCount: (columnId: string) => number;
    isColumnFull: (columnId: string) => boolean;
}

export function useKanban<T extends KanbanItem>({
    initialItems,
    columns,
    onItemMove,
    onItemReorder,
}: UseKanbanOptions<T>): UseKanbanReturn<T> {
    const [items, setItems] = useState<T[]>(initialItems);
    const [isDragging, setDragging] = useState(false);
    const [draggedItem, setDraggedItem] = useState<T | null>(null);

    // Get items for a specific column, sorted by order
    const getColumnItems = useCallback((columnId: string): T[] => {
        return items
            .filter(item => item.columnId === columnId)
            .sort((a, b) => a.order - b.order);
    }, [items]);

    // Get count of items in a column
    const getColumnCount = useCallback((columnId: string): number => {
        return items.filter(item => item.columnId === columnId).length;
    }, [items]);

    // Check if column has reached WIP limit
    const isColumnFull = useCallback((columnId: string): boolean => {
        const column = columns.find(c => c.id === columnId);
        if (!column?.limit) return false;
        return getColumnCount(columnId) >= column.limit;
    }, [columns, getColumnCount]);

    // Move item to a different column
    const moveItem = useCallback(async (itemId: string, toColumnId: string) => {
        const item = items.find(i => i.id === itemId);
        if (!item || item.columnId === toColumnId) return;

        // Check WIP limit
        if (isColumnFull(toColumnId)) {
            console.warn(`Column ${toColumnId} is at WIP limit`);
            return;
        }

        const fromColumn = item.columnId;

        // Calculate new order (add to end of column)
        const targetColumnItems = getColumnItems(toColumnId);
        const newOrder = targetColumnItems.length > 0
            ? Math.max(...targetColumnItems.map(i => i.order)) + 1
            : 0;

        // Update local state
        setItems(prev => prev.map(i =>
            i.id === itemId
                ? { ...i, columnId: toColumnId, order: newOrder }
                : i
        ));

        // Call external handler
        if (onItemMove) {
            try {
                await onItemMove(item as T, fromColumn, toColumnId);
            } catch (error) {
                // Revert on error
                setItems(prev => prev.map(i =>
                    i.id === itemId
                        ? { ...i, columnId: fromColumn, order: item.order }
                        : i
                ));
            }
        }
    }, [items, getColumnItems, isColumnFull, onItemMove]);

    // Reorder item within its column
    const reorderItem = useCallback(async (itemId: string, newOrder: number) => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        const oldOrder = item.order;

        // Update local state
        setItems(prev => {
            return prev.map(i => {
                if (i.id === itemId) {
                    return { ...i, order: newOrder };
                }
                // Shift other items in the same column
                if (i.columnId === item.columnId) {
                    if (oldOrder < newOrder && i.order > oldOrder && i.order <= newOrder) {
                        return { ...i, order: i.order - 1 };
                    }
                    if (oldOrder > newOrder && i.order >= newOrder && i.order < oldOrder) {
                        return { ...i, order: i.order + 1 };
                    }
                }
                return i;
            });
        });

        // Call external handler
        if (onItemReorder) {
            try {
                await onItemReorder(item as T, newOrder);
            } catch (error) {
                // Revert on error
                setItems(prev => prev.map(i =>
                    i.id === itemId ? { ...i, order: oldOrder } : i
                ));
            }
        }
    }, [items, onItemReorder]);

    // Add new item
    const addItem = useCallback((item: T) => {
        setItems(prev => [...prev, item]);
    }, []);

    // Remove item
    const removeItem = useCallback((itemId: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    }, []);

    // Update item
    const updateItem = useCallback((itemId: string, updates: Partial<T>) => {
        setItems(prev => prev.map(i =>
            i.id === itemId ? { ...i, ...updates } : i
        ));
    }, []);

    return {
        items,
        columns,
        getColumnItems,
        moveItem,
        reorderItem,
        addItem,
        removeItem,
        updateItem,
        isDragging,
        setDragging,
        draggedItem,
        setDraggedItem,
        getColumnCount,
        isColumnFull,
    };
}

/**
 * Default kanban columns for project management
 */
export const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
    { id: 'backlog', title: 'Backlog', color: '#6b7280' },
    { id: 'todo', title: 'To Do', color: '#3b82f6' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', limit: 5 },
    { id: 'review', title: 'Review', color: '#8b5cf6', limit: 3 },
    { id: 'done', title: 'Done', color: '#10b981' },
];
