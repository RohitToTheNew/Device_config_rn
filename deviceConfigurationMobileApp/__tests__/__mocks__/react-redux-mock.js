let store = {
  connectedDevice: {id: 1, localName: 'Brx-emulator'},
  inputVolumeSettings: [
    {
      settingName: 'Classroom Microphones',
      settingAdvName: 'ae_ms.mixer.ch4',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 1,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Remote Port 1',
      settingAdvName: 'ae_ms.mixer.ch1',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 2,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Remote Port 2',
      settingAdvName: 'ae_ms.mixer.ch2',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 3,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Remote Port 3',
      settingAdvName: 'ae_ms.mixer.ch3',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 4,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Line Input 5',
      settingAdvName: 'ae_ms.mixer.ch5',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 5,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Line Input 6',
      settingAdvName: 'ae_ms.mixer.ch6',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 6,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Intercom/Paging/Bells',
      settingAdvName: 'ae_ms.mixer.ch100',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 7,
      isDisabled: false,
      isMuted: true,
    },
  ],
  outputVolumeSettings: [
    {
      settingName: 'Speaker Output',
      settingAdvName: 'ae_ms.volume.out0',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 11,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Remote Port 1',
      settingAdvName: 'ae_ms.volume.out1',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 22,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Remote Port 2',
      settingAdvName: 'ae_ms.volume.out2',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 33,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'Remote Port 3',
      settingAdvName: 'ae_ms.volume.out3',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 44,
      isDisabled: false,
      isMuted: false,
    },
    {
      settingName: 'ALD Output',
      settingAdvName: 'ae_ms.volume.out4',
      defaultValue: '-10',
      value: '-10',
      charactersticId: 55,
      isDisabled: false,
      isMuted: true,
    },
  ],
};

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useSelector: () => {
      return store;
    },
    useDispatch: jest.fn().mockImplementation(() => {
      return () => {};
    }),
  };
});
