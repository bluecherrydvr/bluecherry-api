// Basic service to trigger Bluecherry recordings.  Schedule must be set to 'T' (currently, may change to 'O')
// Uses trigger logic found in https://github.com/bluecherrydvr/bluecherry-apps/blob/4d28fa72e8b7cf3d6c4e6a404f7c81c2e98c30e6/server/trigger_server.cpp#L17

// In bluecherry-api/src/routes/controllers/Media/mediaTrigger.ts
export class MediaTrigger {
    private static readonly SOCKET_PATH = '/tmp/bluecherry_trigger';

    static async trigger(deviceId: number, description: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const socket = net.createConnection(SOCKET_PATH);
            
            socket.on('error', (err) => {
                reject(`Failed to connect to socket: ${err.message}`);
            });

            socket.on('connect', () => {
                const msg = `${deviceId} ${description}`;
                socket.write(msg);
            });

            socket.on('data', (data) => {
                const response = data.toString().trim();
                socket.end();
                resolve(response);
            });
        });
    }
}
