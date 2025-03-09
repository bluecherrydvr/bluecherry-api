import {Request, Response, NextFunction} from 'express';
import {Devices} from '../../../models/db/Device';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Server} from '../../../server';
import {Cam} from 'onvif';

async function getCamera(deviceId: number) {
    const device = await Devices.findOne({where: {id: deviceId}});
    if (!device) {
        throw new Error('Device not found');
    }

    return new Promise((resolve, reject) => {
        const cam = new Cam({
            hostname: device.dataValues.ipAddress,
            username: device.dataValues.rtsp_username,
            password: device.dataValues.rtsp_password,
            port: device.dataValues.onvif_port
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

export async function ptzContinuous(
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const {direction, duration} = req.body;
        const cam: any = await getCamera(deviceId);

        let velocity = {x: 0.0, y: 0.0, zoom: 0.0};
        switch (direction) {
            case 'up': velocity.y = 0.5; break;
            case 'down': velocity.y = -0.5; break;
            case 'left': velocity.x = -0.5; break;
            case 'right': velocity.x = 0.5; break;
            case 'zoom_in': velocity.zoom = 0.5; break;
            case 'zoom_out': velocity.zoom = -0.5; break;
            default: 
                res.status(400).send(new ErrorResponse(400, 'Invalid direction'));
                return;
        }

        cam.continuousMove(velocity);
        setTimeout(() => {
            cam.stop();
            Server.Logs.debug(`Stopped movement after ${duration} seconds.`);
        }, (duration || 3) * 1000);

        res.status(200).send(new ErrorResponse(200, `Moving ${direction} for ${duration || 3} seconds`));
    } catch (error) {
        Server.Logs.error(`PTZ Move failed: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'PTZ Move failed'));
    }
}

export async function ptzAbsolute(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const {x, y, zoom} = req.body;
        const cam: any = await getCamera(deviceId);
        
        cam.absoluteMove({x, y, zoom});
        res.status(200).send(new ErrorResponse(200, `Moved to X=${x}, Y=${y}, Zoom=${zoom}`));
    } catch (error) {
        Server.Logs.error(`PTZ Absolute Move failed: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'PTZ Absolute Move failed'));
    }
}

export async function ptzStop(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const deviceId = parseInt(req.params.deviceId);
        const cam: any = await getCamera(deviceId);
        
        cam.stop();
        res.status(200).send(new ErrorResponse(200, 'Stopped all PTZ movement'));
    } catch (error) {
        Server.Logs.error(`Failed to stop PTZ movement: ${error}`);
        res.status(500).send(new ErrorResponse(500, 'Failed to stop PTZ movement'));
    }
}
