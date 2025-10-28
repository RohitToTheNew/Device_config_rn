import {UUIDMappingMS700} from '../../../constants';
import {UPDATE_VOLUME_SETTINGS} from '../constants';

const initialState = {
  bypassEQ:false,
  noiseSuppressionEnabled:false,
  noiseSuppressionThreshold:-50,
  speakerImpedence:'2',
  inputVolumeSettings:[],
  inputVolumeSettingsMS700: [
    {
      settingName: 'Classroom Microphones',
      settingAdvName: 'ae_ms.mixer.ch4',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.classroomMicrophone,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteClassroomMicrophone
    },
    {
      settingName: 'Remote Port 1',
      settingAdvName: 'ae_ms.mixer.ch1',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.remotePort1,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteInputRP1
    },
    {
      settingName: 'Remote Port 2',
      settingAdvName: 'ae_ms.mixer.ch2',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.remotePort2,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteInputRP2
    },
    {
      settingName: 'Remote Port 3',
      settingAdvName: 'ae_ms.mixer.ch3',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.remotePort3,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteInputRP3
    },
    {
      settingName: 'Line Input 5',
      settingAdvName: 'ae_ms.mixer.ch5',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.lineInput5,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteLineInput1
    },
    {
      settingName: 'Line Input 6',
      settingAdvName: 'ae_ms.mixer.ch6',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.lineInput6,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteLineInput2
    },
    {
      settingName: 'Intercom/Paging/Bells',
      settingAdvName: 'ae_ms.mixer.ch100',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.intercomPagingBells,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteIntercomPaging
    },
  ],
  outputVolumeSettings:[],
  outputVolumeSettingsMS700: [
    {
      settingName: 'Speaker Output',
      settingAdvName: 'ae_ms.volume.out0',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.speakerOutput,
      isDisabled: false,
      muteCharacter: UUIDMappingMS700.muteSpeakerOutput
    },
    {
      settingName: 'Remote Port 1',
      settingAdvName: 'ae_ms.volume.out1',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.remotePort1Output,
      isDisabled: false,
      muteCharacter: UUIDMappingMS700.muteOutputRP1
    },
    {
      settingName: 'Remote Port 2',
      settingAdvName: 'ae_ms.volume.out2',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.remotePort2Output,
      isDisabled: false,
      muteCharacter: UUIDMappingMS700.muteOutputRP2
    },
    {
      settingName: 'Remote Port 3',
      settingAdvName: 'ae_ms.volume.out3',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.remotePort3Output,
      isDisabled: false,
      muteCharacter: UUIDMappingMS700.muteOutputRP3
    },
    {
      settingName: 'ALD Output',
      settingAdvName: 'ae_ms.volume.out4',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.aldOutput,
      isDisabled: false,
      muteCharacter: UUIDMappingMS700.muteALD
    },
  ],
  eqVolumeSettings: [
    {
      settingName: 'Band 1',
      settingAdvName: 'ae_ms.eq.band1',
      defaultValue: '4',
      value: '4',
      charactersticId: UUIDMappingMS700.eqBand1,
      isDisabled: false,
      maxValue:10
    },
    {
      settingName: 'Band 2',
      settingAdvName: 'ae_ms.eq.band2',
      defaultValue: '-5',
      value: '-5',
      charactersticId: UUIDMappingMS700.eqBand2,
      isDisabled: false,
      maxValue:10
    },
    {
      settingName: 'Band 3',
      settingAdvName: 'ae_ms.eq.band3',
      defaultValue: '0',
      value: '0',
      charactersticId: UUIDMappingMS700.eqBand3,
      isDisabled: false,
      maxValue:10
    },
    {
      settingName: 'Band 4',
      settingAdvName: 'ae_ms.eq.band4',
      defaultValue: '6',
      value: '6',
      charactersticId: UUIDMappingMS700.eqBand4,
      isDisabled: false,
      maxValue:10
    },
    {
      settingName: 'Band 5',
      settingAdvName: 'ae_ms.eq.band5',
      defaultValue: '-3',
      value: '-3',
      charactersticId: UUIDMappingMS700.eqBand5,
      isDisabled: false,
      maxValue:10
    },
  ],
  inputVolumeSettingsCZA1300: [
    {
      settingName: 'Microphones',
      settingAdvName: 'ae_ms.mixer.ch4',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.classroomMicrophone,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteClassroomMicrophone
    },
    {
      settingName: 'Remote Port 1',
      settingAdvName: 'ae_ms.mixer.ch1',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.remotePort1,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteInputRP1
    },
    {
      settingName: '3.5mm Line in',
      settingAdvName: 'ae_ms.mixer.ch2',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.lineInput5,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteLineInput1
    },
    {
      settingName: 'Intercom/Paging/Bells',
      settingAdvName: 'ae_ms.mixer.ch100',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.intercomPagingBells,
      isDisabled: false,
      isMuted: false,
      muteCharacter: UUIDMappingMS700.muteIntercomPaging
    },
  ],
  outputVolumeSettingsCZA1300:[
    {
      settingName: 'Remote Port 1',
      settingAdvName: 'ae_ms.volume.out1',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.remotePort1Output,
      isDisabled: false,
      muteCharacter: UUIDMappingMS700.muteOutputRP1
    },
    {
      settingName: 'ALD Output',
      settingAdvName: 'ae_ms.volume.out4',
      defaultValue: '-10',
      value: '-10',
      charactersticId: UUIDMappingMS700.aldOutput,
      isDisabled: false,
      muteCharacter: UUIDMappingMS700.muteALD
    },
  ]
};

export const volumeSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VOLUME_SETTINGS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
