import { Alert, Button, Text, View, Platform } from 'react-native';
import React, { Component, createContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

const pkg = Constants.manifest.releaseChannel
  ? Constants.manifest.android.package // When published, considered as using standalone build
  : 'host.exp.exponent'; // In expo client mode

export const AudioContext = createContext();

export default class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
    };
  }

  openSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        // console.log(Constants);
        startActivityAsync(ActivityAction.APPLICATION_DETAILS_SETTINGS, {
          data: 'package:' + pkg,
        });
      }
      if (Platform.OS === 'ios') {
        Linking.openSettings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  permissionAlert = () => {
    Alert.alert(
      'Permission Required',
      'This App needs to read your audio files!',
      [
        { text: 'Accept', onPress: this.getPermission() },
        { text: 'Cancel', onPress: this.permissionAlert() },
      ]
    );
  };

  getAudioFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
    });

    // a trick to get all audio files at once
    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: media.totalCount,
    });
    this.setState({ ...this.state, audioFiles: media.assets });
  };

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
    console.log(permission);
    if (permission.granted) {
      // get all the audio files
      this.getAudioFiles();
    }

    if (!permission.granted) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      console.log(status);
      if (status === 'denied' && canAskAgain) {
        // display an alert that user must allow this permission to use this app
        this.permissionAlert();
      }

      if (status === 'denied' && !canAskAgain) {
        // display some error to the user
        this.setState({ ...this.state, permissionError: true });
      }

      if (status === 'granted') {
        // get all the audio files
        this.getAudioFiles();
      }
    }
    if (!permission.canAskAgain) {
      // display some error to the user
      this.setState({ ...this.state, permissionError: true });
    }
  };

  componentDidMount() {
    this.getPermission();
  }
  render() {
    if (this.state.permissionError) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 25, textAlign: 'center', color: 'tomato' }}>
            It looks like you haven't accept permission
          </Text>
          <Button
            onPress={this.openSettings}
            title='Open Settings to grant Permission'
          />
        </View>
      );
    }
    return (
      <AudioContext.Provider value={{ audioFiles: this.state.audioFiles }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}
