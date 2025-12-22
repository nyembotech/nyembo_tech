/**
 * API Types
 * 
 * Proper type definitions to replace `any` types across API routes and handlers.
 */

import { Timestamp } from "firebase/firestore";
import { LucideIcon } from "lucide-react";

// =============================================================================
// Error Types
// =============================================================================

export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
    status: number;
}

export type ErrorCode =
    | 'VALIDATION_ERROR'
    | 'AUTHENTICATION_ERROR'
    | 'AUTHORIZATION_ERROR'
    | 'NOT_FOUND'
    | 'RATE_LIMITED'
    | 'INTERNAL_ERROR'
    | 'SERVICE_UNAVAILABLE'
    | 'BAD_REQUEST';

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

export interface ApiErrorResponse {
    success: false;
    error: ApiError;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// =============================================================================
// Form & Dialog Types
// =============================================================================

export interface DialogSubmitHandler<T> {
    (data: T): Promise<void>;
}

export interface FormChangeHandler<T = string> {
    (field: string, value: T): void;
}

// =============================================================================
// Component Prop Types
// =============================================================================

export interface IconProps {
    className?: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
    children?: NavItem[];
}

export interface StatusTileProps {
    title: string;
    icon: LucideIcon;
    status: 'healthy' | 'warning' | 'error' | 'unknown';
    metric?: string;
}

export interface SceneCardProps {
    name: string;
    icon: LucideIcon;
    color: string;
    active: boolean;
    onClick?: () => void;
}

export interface ControlTileProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    type: 'toggle' | 'slider' | 'info';
    checked?: boolean;
    onChange?: (value: boolean | number) => void;
}

// =============================================================================
// Firestore Timestamp Helpers
// =============================================================================

export type FirestoreTimestamp = Timestamp | Date | { seconds: number; nanoseconds: number };

export function isFirestoreTimestamp(value: unknown): value is Timestamp {
    return value !== null &&
        typeof value === 'object' &&
        'toDate' in value &&
        typeof (value as Timestamp).toDate === 'function';
}

export function toDate(value: FirestoreTimestamp | undefined | null): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (isFirestoreTimestamp(value)) return value.toDate();
    if ('seconds' in value) return new Date(value.seconds * 1000);
    return undefined;
}

// =============================================================================
// Chat & AI Types
// =============================================================================

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt?: Date;
}

export interface ChatOptions {
    onError?: (error: Error) => void;
    onFinish?: (message: ChatMessage) => void;
}

// =============================================================================
// IoT Types
// =============================================================================

export interface DeviceEventPayload {
    timestamp: number;
    value: unknown;
    unit?: string;
    metadata?: Record<string, unknown>;
}

export interface DeviceCommandParams {
    action: string;
    value?: unknown;
    options?: Record<string, unknown>;
}

// =============================================================================
// Select/Form Value Types
// =============================================================================

export type CustomerType = 'individual' | 'company';
export type CustomerStatus = 'active' | 'inactive' | 'pending';
export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type DocumentType = 'contract' | 'report' | 'spec' | 'other';
export type DocumentVisibility = 'public' | 'private' | 'team';
