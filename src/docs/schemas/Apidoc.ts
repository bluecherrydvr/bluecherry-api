// Add to imports
import { ptzOperations } from './Ptz';
import { ptzOperations as ptzSchemas } from './schemas/PtzOperations';

const documentation = {
  // ... existing configuration ...
  
  tags: [
    // ... existing tags ...
    { name: 'PTZ' }
  ],

  paths: {
    // ... existing paths ...
    
    '/devices/{deviceId}/ptz/continuous': {
      post: ptzOperations.ptzContinuous
    },
    '/devices/{deviceId}/ptz/absolute': {
      post: ptzOperations.ptzAbsolute
    },
    '/devices/{deviceId}/ptz/stop': {
      post: ptzOperations.ptzStop
    },
    '/devices/{deviceId}/ptz/presets': {
      get: ptzOperations.getPtzPresets
    },
    '/devices/{deviceId}/ptz/preset': {
      post: ptzOperations.gotoPreset
    },
    '/devices/{deviceId}/ptz/preset/set': {
      post: ptzOperations.setPreset
    }
  },

  components: {
    // ... existing components ...
    schemas: {
      // ... existing schemas ...
      ptzContinuous: ptzSchemas.ptzContinuous,
      ptzAbsolute: ptzSchemas.ptzAbsolute,
      ptzPreset: ptzSchemas.ptzPreset
    }
  }
};

