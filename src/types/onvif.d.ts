// src/types/onvif.d.ts

declare module 'onvif' {
    export class Cam {
        constructor(options: {
            hostname: string;
            username: string;
            password: string;
            port: number;
        }, callback: (error: Error | null) => void);

        continuousMove(velocity: {
            x: number;
            y: number;
            zoom: number;
        }): void;

        absoluteMove(position: {
            x: number;
            y: number;
            zoom: number;
        }): void;

        stop(): void;

        getStatus(callback: (error: Error | null, status: {
            position: {
                x: number;
                y: number;
                zoom: number;
            }
        }) => void): void;

        getPresets(options: any, callback: (error: Error | null, presets: Array<{
            token: string;
            name: string;
            position: {
                x: number;
                y: number;
                zoom: number;
            }
        }>) => void): void;

        gotoPreset(options: {
            preset: string;
        }, callback: (error: Error | null) => void): void;

        setPreset(options: {
            presetName: string;
        }, callback: (error: Error | null, preset: {
            token: string;
            name: string;
            position: {
                x: number;
                y: number;
                zoom: number;
            }
        }) => void): void;
    }
}

