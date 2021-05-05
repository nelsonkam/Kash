import {Mixpanel} from 'mixpanel-react-native';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';
import Analytics from 'appcenter-analytics';

export async function track(event: any, props = {}) {
  if (__DEV__) {
    return;
  }
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    const mixpanel = await Mixpanel.init('1e6c7231e8bd05c780b6c911a2788669');
    return mixpanel.track(event, props);
  }
}

export async function identify(id: string) {
  if (__DEV__) {
    return;
  }
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    const mixpanel = await Mixpanel.init('1e6c7231e8bd05c780b6c911a2788669');
    await Analytics.setEnabled(false);
    return mixpanel.identify(id);
  }
}
