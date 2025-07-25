import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MainContainer from '../../../components/MainContainer';
import CustomTopTabView from '../../../components/CustomTopTabView';
import Medias from './Medias';
import Docs from './Docs';
import Links from './Links';

const MediaLinksDocs = () => {
  // const tabs = [
  //   {
  //     title: 'Medias',
  //     value: 'medias',
  //     component: <Medias />,
  //   },
  //   {
  //     title: 'Docs',
  //     value: 'docs',
  //     component: <Docs />,
  //   },
  //   {
  //     title: 'Links',
  //     value: 'links',
  //     component: <Links />,
  //   },
  // ];
  return (
    <MainContainer isBack title="Pavan Thakur">
      {/* <CustomTopTabView tabs={tabs} /> */}
    </MainContainer>
  );
};

export default MediaLinksDocs;

const styles = StyleSheet.create({});
