import {Type} from '@sinclair/typebox';

const AddDeviceRequest = Type.Object({
  camName: Type.String({default: null}),
  ipAddress: Type.String({default: null}),
  username: Type.String({default: null}),
  password: Type.String({default: null}),
  protocol: Type.String({default: null}),
  rtspPath: Type.String({default: null}),
  substreamPath: Type.String({default: null}),
  rtspPort: Type.Integer({default: null}),
  preferTcp: Type.Boolean({default: null}),
  substreamMode: Type.Optional(Type.Integer({default: false})),
  model: Type.Optional(Type.String({default: 0})),
  mjpegPath: Type.Optional(Type.String({default: '/'})),
  mjpegPort: Type.Optional(Type.Number({default: 80})),
  onvifPort: Type.Optional(Type.Number({default: 80})),
  hlsWindowSize: Type.Optional(Type.Number({default: 5})),
  hlsSegmentSize: Type.Optional(Type.Number({default: 0})),
  hlsSegmentDuration: Type.Optional(Type.Number({default: 0})),
  audioEnabled: Type.Optional(Type.Boolean({default: false})),
});

export {AddDeviceRequest};
