import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {topTabContainer} from '../sharedStyles';
import {myConsole} from '../utils/myConsole';

interface TabItem {
  title: string;
  value: string;
  component: React.ReactNode;
}

interface CustomTopTabViewProps {
  tabs: TabItem[];
}

const CustomTopTabView: React.FC<CustomTopTabViewProps> = ({tabs}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const pagerRef = useRef<PagerView>(null);

  const centerTab = (index: number) => {
    if (scrollViewRef.current) {
      const tabButtonWidth = 120; // Adjust width as needed
      const windowWidth = Dimensions.get('window').width;
      const offset =
        index * tabButtonWidth - windowWidth / 2 + tabButtonWidth / 2;
      scrollViewRef.current.scrollTo({
        x: Math.max(offset, 0),
        animated: true,
      });
    }
  };

  const onTabPress = (index: number) => {
    setSelectedTab(index);
    pagerRef.current?.setPage(index);
    centerTab(index);
  };

  const onPageSelected = (e: any) => {
    const newIndex = e.nativeEvent.position;
    setSelectedTab(newIndex);
    centerTab(newIndex);
  };

  return (
    <>
      <View style={topTabContainer.tabHeaderContainer}>
        <ScrollView
          horizontal
          style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.value}
              activeOpacity={0.6}
              style={[
                topTabContainer.tabButton,
                selectedTab === index && topTabContainer.selectedTab,
              ]}
              onPress={() => onTabPress(index)}>
              <Text
                style={[
                  topTabContainer.tabTitle,
                  selectedTab === index && topTabContainer.selectedTabText,
                ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <PagerView
        ref={pagerRef}
        style={topTabContainer.pagerView}
        initialPage={0}
        onPageSelected={onPageSelected}>
        {tabs.map((tab, index) => (
          <View key={index} style={{flex: 1}}>
            {tab.component}
          </View>
        ))}
      </PagerView>
    </>
  );
};

export default CustomTopTabView;
