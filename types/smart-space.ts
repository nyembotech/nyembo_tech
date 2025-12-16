import { Timestamp } from "firebase/firestore";

export type DeviceType = 'light' | 'thermostat' | 'lock' | 'camera' | 'sensor' | 'switch';
export type DeviceStatus = 'online' | 'offline' | 'error' | 'maintenance';

export interface BaseDevice {
    id: string;
    smartSpaceId: string;
    name: string;
    type: DeviceType;
    vendor: string; // e.g., 'philips-hue', 'nest', 'generic-mqtt'
    status: DeviceStatus;
    lastSeen: Date | Timestamp;
    batteryLevel?: number; // percentage
    firmwareVersion?: string;
}

export interface LightDevice extends BaseDevice {
    type: 'light';
    state: {
        on: boolean;
        brightness?: number; // 0-100
        color?: string; // hex
        colorTemperature?: number; // kelvin
    };
}

export interface ThermostatDevice extends BaseDevice {
    type: 'thermostat';
    state: {
        currentTemp: number;
        targetTemp: number;
        mode: 'heat' | 'cool' | 'auto' | 'off';
        humidity?: number;
    };
}

export interface LockDevice extends BaseDevice {
    type: 'lock';
    state: {
        locked: boolean;
        isJammed?: boolean;
    };
}

export interface CameraDevice extends BaseDevice {
    type: 'camera';
    state: {
        isRecording: boolean;
        streamUrl?: string; // Secure signed URL
        lastMotionDetected?: Date | Timestamp;
    };
}

export interface SensorDevice extends BaseDevice {
    type: 'sensor';
    sensorType: 'motion' | 'temperature' | 'smoke' | 'leak';
    value: number | boolean; // e.g., true for motion, 22.5 for temp
    unit?: string;
}

export type SmartDevice = LightDevice | ThermostatDevice | LockDevice | CameraDevice | SensorDevice;

export interface Scene {
    id: string;
    name: string;
    icon: string;
    description?: string;
    smartSpaceId: string;
    actions: {
        deviceId: string;
        action: 'turnOn' | 'turnOff' | 'setBrightness' | 'setTemp' | 'lock' | 'unlock';
        payload?: any;
    }[];
}

export interface SmartSpace {
    id: string;
    name: string;
    location: string;
    type: 'residential' | 'office' | 'industrial';
    customerId: string; // Owner
    imageUrl?: string;
}

export interface DeviceLog {
    id: string;
    deviceId: string;
    smartSpaceId: string;
    eventType: 'status_change' | 'error' | 'user_interaction' | 'automation';
    details: string;
    timestamp: Date | Timestamp;
    value?: any;
}
