const React = require('react');

// Stub all icon sets as simple Text components
function createMockIcon(name) {
  const Icon = (props) => React.createElement('Text', props, props.name || name);
  Icon.displayName = name;
  return Icon;
}

module.exports = {
  Ionicons: createMockIcon('Ionicons'),
  MaterialIcons: createMockIcon('MaterialIcons'),
  FontAwesome: createMockIcon('FontAwesome'),
  Feather: createMockIcon('Feather'),
  AntDesign: createMockIcon('AntDesign'),
  Entypo: createMockIcon('Entypo'),
};
