jest.mock('react-native-qrcode-scanner', () => {
  const React = require('react');
  const PropTypes = require('prop-types');
  const { View } = require('react-native');
  return class MockQRCodeScanner extends React.Component {
    static propTypes = { children: PropTypes.any };
    static defaultProps = { reactivate: false };

    render() {
      const children = [];
      if (this.props.topContent) {
        children.push(React.cloneElement(this.props.topContent, { key: 'top' }));
      }
      if (this.props.children) {
        children.push(React.cloneElement(this.props.children, { key: 'children' }));
      }
      if (this.props.bottomContent) {
        children.push(React.cloneElement(this.props.bottomContent, { key: 'bottom' }));
      }
      return React.createElement(
        'react-native-qrcode-scanner',
        this.props,
        children,
      );
    }
  };
});
