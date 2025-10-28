declare module 'redux-persist/integration/react' {
  import {ReactNode, Component} from 'react';
  import {Persistor} from 'redux-persist';

  interface PersistGateProps {
    loading?: ReactNode | null;
    persistor: Persistor;
    onBeforeLift?(): void | Promise<void>;
    children: ReactNode;
  }

  class PersistGate extends Component<PersistGateProps> {}

  export {PersistGate};
}
