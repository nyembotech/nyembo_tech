"use client";

import { ReactNode } from "react";
import { Button } from "./button";
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginatedListProps<T> {
    items: T[];
    loading: boolean;
    renderItem: (item: T, index: number) => ReactNode;
    emptyMessage?: string;
    className?: string;
    itemClassName?: string;
    gridCols?: 1 | 2 | 3 | 4;

    // Pagination props
    pagination?: {
        page: number;
        pageSize: number;
        totalPages?: number;
        hasNext: boolean;
        hasPrev: boolean;
        onNext: () => void;
        onPrev: () => void;
        onFirst?: () => void;
        onLast?: () => void;
    };

    // Infinite scroll props
    infiniteScroll?: {
        hasMore: boolean;
        isLoadingMore: boolean;
        onLoadMore: () => void;
    };
}

/**
 * PaginatedList - Reusable list component with pagination or infinite scroll
 */
export function PaginatedList<T extends { id: string }>({
    items,
    loading,
    renderItem,
    emptyMessage = "No items found",
    className,
    itemClassName,
    gridCols = 1,
    pagination,
    infiniteScroll,
}: PaginatedListProps<T>) {
    const gridClasses = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    if (loading && items.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!loading && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Items Grid/List */}
            <div className={cn("grid gap-4", gridClasses[gridCols])}>
                {items.map((item, index) => (
                    <div key={item.id} className={itemClassName}>
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>

            {/* Traditional Pagination */}
            {pagination && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="text-sm text-muted-foreground">
                        Page {pagination.page}
                        {pagination.totalPages && ` of ${pagination.totalPages}`}
                    </div>

                    <div className="flex items-center gap-2">
                        {pagination.onFirst && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={pagination.onFirst}
                                disabled={!pagination.hasPrev}
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={pagination.onPrev}
                            disabled={!pagination.hasPrev}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={pagination.onNext}
                            disabled={!pagination.hasNext}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>

                        {pagination.onLast && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={pagination.onLast}
                                disabled={!pagination.hasNext}
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Infinite Scroll */}
            {infiniteScroll && infiniteScroll.hasMore && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={infiniteScroll.onLoadMore}
                        disabled={infiniteScroll.isLoadingMore}
                        className="min-w-[200px]"
                    >
                        {infiniteScroll.isLoadingMore ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

/**
 * Skeleton loader for paginated lists
 */
export function PaginatedListSkeleton({
    count = 5,
    gridCols = 1,
}: {
    count?: number;
    gridCols?: 1 | 2 | 3 | 4;
}) {
    const gridClasses = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    return (
        <div className={cn("grid gap-4", gridClasses[gridCols])}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="h-24 rounded-lg bg-muted animate-pulse"
                />
            ))}
        </div>
    );
}
