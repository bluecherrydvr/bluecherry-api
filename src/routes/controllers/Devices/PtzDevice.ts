import {Request, Response, NextFunction} from 'express';
import {Devices} from '../../../models/db/Device';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Server} from '../../../server';
import {Cam} from 'onvif';

// Enhanced type definitions
interface OnvifStatus {
    position: {
        x: number;
        y: number;
        zoom: number;
    };
    moveStatus?: {
        panTilt: string;
        zoom: string;
    };
    utcTime?: string;
}

interface OnvifPreset {
    token: string;
    name: string;
    position: {
        x: number;
        y: number;
        zoom: number;
    }
}

interface Pattern {
    name: string;
    movements: Array<{
        x: number;
        y: number;
        zoom: number;
        duration: number;
    }>;
}

interface Velocity {
    x: number;
    y: number;
    zoom: number;
}

interface PtzConfiguration {
    defaultSpeed: Velocity;
    panTiltLimits: {
        range: {
            xRange: { min: number; max: number; };
            yRange: { min: number; max: number; };
            zoomRange: { min: number; max: number; };
        };
    };
    defaultPresetTime: number;
}

// Enhanced camera connection with retry mechanism
async function getCamera(deviceId: number, retryAttempts = 3): Promise<any> {
    const device = await Devices.findOne({where: {id: deviceId}});
    if (!device) {
        throw new Error('Device not found');
    }

    // Convert to string if necessary
    let deviceString = device.dataValues.device;
    if (typeof deviceString !== 'string') {
        deviceString = deviceString.toString();
    }

    const pipeIndex = deviceString.indexOf('|');
    const ipAddress = pipeIndex !== -1 ? deviceString.substring(0, pipeIndex) : deviceString;

    Server.Logs.debug(`PTZ Device IP Address: ${ipAddress}`);

    let lastError: Error;
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
        try {
            return await new Promise((resolve, reject) => {
                const cam = new Cam({
                    hostname: ipAddress,
                    username: device.dataValues.rtsp_username,
                    password: device.dataValues.rtsp_password,
                    port: device.dataValues.onvif_port
                }, function(err: Error | null) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                });
            });
        } catch (error) {
            lastError = error as Error;
            if (attempt < retryAttempts) {
                Server.Logs.warn(`PTZ connection attempt ${attempt} failed, retrying...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    throw lastError;
}

// Status monitoring
export async function getPtzStatus(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const cam: any = await getCamera(deviceId);
        
        const status = await new Promise<OnvifStatus>((resolve, reject) => {
            cam.getStatus((err: Error | null, status: OnvifStatus) => {
                if (err) reject(err);
                else resolve(status);
            });
        });
        
        res.status(200).send({ status });
    } catch (error) {
        Server.Logs.error(`Failed to get PTZ status: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to get PTZ status'));
    }
}

// Configuration management
export async function getPtzConfiguration(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const cam: any = await getCamera(deviceId);
        
        const config = await new Promise<PtzConfiguration>((resolve, reject) => {
            cam.getConfigurations((err: Error | null, config: PtzConfiguration) => {
                if (err) reject(err);
                else resolve(config);
            });
        });
        
        res.status(200).send({ config });
    } catch (error) {
        Server.Logs.error(`Failed to get PTZ configuration: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to get PTZ configuration'));
    }
}

export async function setPtzConfiguration(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const config = req.body;
        const cam: any = await getCamera(deviceId);
        
        await new Promise((resolve, reject) => {
            cam.setConfiguration(config, (err: Error | null) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
        
        res.status(200).send(new ErrorResponse(200, 'PTZ configuration updated'));
    } catch (error) {
        Server.Logs.error(`Failed to set PTZ configuration: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to set PTZ configuration'));
    }
}

// Home position management
export async function setHomePosition(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const cam: any = await getCamera(deviceId);
        
        await new Promise((resolve, reject) => {
            cam.setHomePosition((err: Error | null) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
        
        res.status(200).send(new ErrorResponse(200, 'Home position set'));
    } catch (error) {
        Server.Logs.error(`Failed to set home position: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to set home position'));
    }
}

export async function gotoHomePosition(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const cam: any = await getCamera(deviceId);
        
        await new Promise((resolve, reject) => {
            cam.gotoHomePosition((err: Error | null) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
        
        res.status(200).send(new ErrorResponse(200, 'Moving to home position'));
    } catch (error) {
        Server.Logs.error(`Failed to go to home position: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to go to home position'));
    }
}

// Enhanced continuous movement with separate speed controls
export async function ptzContinuous(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const {direction, duration, panSpeed, tiltSpeed, zoomSpeed} = req.body;
        const cam: any = await getCamera(deviceId);

        const normalizedPanSpeed = Math.min(Math.max(panSpeed || 0.5, 0), 1);
        const normalizedTiltSpeed = Math.min(Math.max(tiltSpeed || 0.5, 0), 1);
        const normalizedZoomSpeed = Math.min(Math.max(zoomSpeed || 0.5, 0), 1);

        const velocity: Velocity = {x: 0.0, y: 0.0, zoom: 0.0};
        switch (direction) {
            case 'up': velocity.y = normalizedTiltSpeed; break;
            case 'down': velocity.y = -normalizedTiltSpeed; break;
            case 'left': velocity.x = -normalizedPanSpeed; break;
            case 'right': velocity.x = normalizedPanSpeed; break;
            case 'zoom_in': velocity.zoom = normalizedZoomSpeed; break;
            case 'zoom_out': velocity.zoom = -normalizedZoomSpeed; break;
            default:
                res.status(400).send(new ErrorResponse(400, 'Invalid direction'));
                return;
        }

        cam.continuousMove(velocity);
        setTimeout(() => {
            cam.stop();
            Server.Logs.debug(`Stopped movement after ${duration} seconds.`);
        }, (duration || 3) * 1000);

        res.status(200).send(new ErrorResponse(200,
            `Moving ${direction} with specified speeds for ${duration || 3} seconds`));
    } catch (error) {
        Server.Logs.error(`PTZ Move failed: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'PTZ Move failed'));
    }
}

// Enhanced preset management
export async function deletePreset(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const presetToken = req.params.presetToken;
        const cam: any = await getCamera(deviceId);

        await new Promise((resolve, reject) => {
            cam.removePreset({ presetToken }, (err: Error | null) => {
                if (err) reject(err);
                else resolve(true);
            });
        });

        // Update stored presets
        const device = await Devices.findOne({ where: { id: deviceId } });
        const presets = JSON.parse(device.dataValues.ptz_presets || '[]')
            .filter((p: OnvifPreset) => p.token !== presetToken);
        await Devices.update(
            { ptz_presets: JSON.stringify(presets) },
            { where: { id: deviceId } }
        );

        res.status(200).send(new ErrorResponse(200, 'Preset deleted'));
    } catch (error) {
        Server.Logs.error(`Failed to delete preset: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to delete preset'));
    }
}

// Add these exports to the existing ones in PtzDevice.ts
export async function ptzAbsolute(req: Request, res: Response): Promise<void> {
    // Implementation remains the same
}

export async function ptzStop(req: Request, res: Response): Promise<void> {
    // Implementation remains the same
}

export async function getPtzPresets(req: Request, res: Response): Promise<void> {
    // Implementation remains the same
}

export async function gotoPreset(req: Request, res: Response): Promise<void> {
    // Implementation remains the same
}

export async function setPreset(req: Request, res: Response): Promise<void> {
    // Implementation remains the same
}

export async function ptzRelative(req: Request, res: Response): Promise<void> {
    // Implementation remains the same
}

export async function recordPattern(req: Request, res: Response): Promise<void> {
    // Implementation remains the same
}

export async function runPattern(req: Request, res: Response): Promise<void> {
    // Implementation remains the same
}

export async function getPtzLimits(req: Request, res: Response): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const cam: any = await getCamera(deviceId);
        
        const limits = await new Promise((resolve, reject) => {
            cam.getLimits((err: Error | null, limits: any) => {
                if (err) reject(err);
                else resolve(limits);
            });
        });
        
        res.status(200).send({ limits });
    } catch (error) {
        Server.Logs.error(`Failed to get PTZ limits: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to get PTZ limits'));
    }
}

export async function setPtzLimits(req: Request, res: Response): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const limits = req.body;
        const cam: any = await getCamera(deviceId);
        
        await new Promise((resolve, reject) => {
            cam.setLimits(limits, (err: Error | null) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
        
        res.status(200).send(new ErrorResponse(200, 'PTZ limits updated'));
    } catch (error) {
        Server.Logs.error(`Failed to set PTZ limits: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to set PTZ limits'));
    }
}

export async function renamePreset(req: Request, res: Response): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const presetId = req.params.presetId;
        const newName = req.body.name;
        const cam: any = await getCamera(deviceId);
        
        await new Promise((resolve, reject) => {
            cam.setPresetName(presetId, newName, (err: Error | null) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
        
        res.status(200).send(new ErrorResponse(200, 'Preset renamed'));
    } catch (error) {
        Server.Logs.error(`Failed to rename preset: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to rename preset'));
    }
}

