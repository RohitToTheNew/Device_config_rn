import {UPDATE_SERIAL_SETTINGS} from '../constants';

const initialState = {
  settingsMapMS700: [
    {
      id: 1,
      portName: 'Remote Port 1',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 2', selected: false, portNumber: 2},
        {portName: 'Remote Port 3', selected: false, portNumber: 3},
        {portName: 'XD', selected: false, portNumber: 5},
        {portName: 'Serial', selected: false, portNumber: 4},
        {portName: 'Network/EPIC', selected: false, portNumber: 6},
      ],
      selectedBoudRate: '',
    },
    {
      id: 2,
      portName: 'Remote Port 2',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 1', selected: false, portNumber: 1},
        {portName: 'Remote Port 3', selected: false, portNumber: 3},
        {portName: 'XD', selected: false, portNumber: 5},
        {portName: 'Serial', selected: false, portNumber: 4},
        {portName: 'Network/EPIC', selected: false, portNumber: 6},
      ],
      selectedBoudRate: '',
    },
    {
      id: 3,
      portName: 'Remote Port 3',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 1', selected: false, portNumber: 1},
        {portName: 'Remote Port 2', selected: false, portNumber: 2},
        {portName: 'XD', selected: false, portNumber: 5},
        {portName: 'Serial', selected: false, portNumber: 4},
        {portName: 'Network/EPIC', selected: false, portNumber: 6},
      ],
      selectedBoudRate: '',
    },
    {
      id: 4,
      portName: 'XD',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 1', selected: false, portNumber: 1},
        {portName: 'Remote Port 2', selected: false, portNumber: 2},
        {portName: 'Remote Port 3', selected: false, portNumber: 3},
        {portName: 'Serial', selected: false, portNumber: 4},
        {portName: 'Network/EPIC', selected: false, portNumber: 6},
      ],
      selectedBoudRate: '',
    },
    {
      id: 5,
      portName: 'Serial',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 1', selected: false, portNumber: 1},
        {portName: 'Remote Port 2', selected: false, portNumber: 2},
        {portName: 'Remote Port 3', selected: false, portNumber: 3},
        {portName: 'XD', selected: false, portNumber: 5},
        {portName: 'Network/EPIC', selected: false, portNumber: 6},
      ],
      selectedBoudRate: '',
    },
    {
      id: 6,
      portName: 'Network/EPIC',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 1', selected: false, portNumber: 1},
        {portName: 'Remote Port 2', selected: false, portNumber: 2},
        {portName: 'Remote Port 3', selected: false, portNumber: 3},
        {portName: 'XD', selected: false, portNumber: 5},
        {portName: 'Serial', selected: false, portNumber: 4},
      ],
      selectedBoudRate: '',
    },
  ],
  settingsMapCZA1300: [
    {
      id: 1,
      portName: 'Remote Port 1',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'XD', selected: false, portNumber: 5},
        {portName: 'Network/EPIC', selected: false, portNumber: 6},
      ],
      selectedBoudRate: '',
    },
    {
      id: 2,
      portName: 'XD',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 1', selected: false, portNumber: 1},
        {portName: 'Network/EPIC', selected: false, portNumber: 6},
      ],
      selectedBoudRate: '',
    },
    {
      id: 3,
      portName: 'Network/EPIC',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 1', selected: false, portNumber: 1},
        {portName: 'XD', selected: false, portNumber: 5},
      ],
      selectedBoudRate: '',
    },
  ],
  serialSettings:[],
  showUnsavedModal: false,
};

export const serialSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SERIAL_SETTINGS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
