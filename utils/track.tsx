import {Mixpanel} from 'mixpanel-react-native';

export async function track(event, props = {}) {
  const mixpanel = await Mixpanel.init('1e6c7231e8bd05c780b6c911a2788669');
  return mixpanel.track(event, props);
}

export async function identify(id) {
  const mixpanel = await Mixpanel.init('1e6c7231e8bd05c780b6c911a2788669');
  mixpanel.identify(id);
}
