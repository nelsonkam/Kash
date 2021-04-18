import React from 'react';
import {
  ActivityIndicator,
  SectionList,
  SectionListProps,
  View,
} from 'react-native';
import {InfiniteHook} from '../utils/hooks';

type Props = {
  query: InfiniteHook<any>;
};

function InfiniteSectionList<T>({query, ...rest}: Props & SectionListProps<T>) {
  return (
    <SectionList
      onRefresh={() => query.refresh()}
      refreshing={query.isRefreshing}
      onEndReached={() => (!query.hasReachedEnd ? query.loadMore() : null)}
      ListFooterComponent={() =>
        query.isLoadingMore ? (
          <View
            style={{
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator />
          </View>
        ) : null
      }
      {...rest}
    />
  );
}

export default InfiniteSectionList;
