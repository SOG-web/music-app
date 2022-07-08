import { StyleSheet, View, Dimensions } from 'react-native';
import React, { Component } from 'react';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import { Audio } from 'expo-av';

import { AudioContext } from '../context';
import AudioListItems from '../components/AudioListItems';
import OptionModal from '../components/OptionModal';
import { pause, play, playNext, resume } from '../misc/audioController';

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      currentItem: {},
    };
  }

  layoutProvider = new LayoutProvider(
    (i) => 'audio',
    (type, dim) => {
      // console.log(type);
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;

        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  controlModal = (item) => {
    const optionModalVisible = this.state.optionModalVisible;
    this.setState({
      ...this.state,
      currentItem: item,
      optionModalVisible: !optionModalVisible,
    });
  };

  handleAudioPress = async (audio) => {
    const { soundObj, playBackObj, currentAudio, updateState, audioFiles } =
      this.context;
    // console.log(audio);

    const index = audioFiles.indexOf(audio);

    // playing audio for the first time
    if (soundObj === null) {
      const playBackObj = new Audio.Sound();
      const status = await play(playBackObj, audio.uri);
      // console.log(status);
      return updateState(this.context, {
        currentAudio: audio,
        playBackObj: playBackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }

    // pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playBackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: false,
      });
    }

    // resume audio
    if (
      !soundObj.isPlaying &&
      soundObj.isLoaded &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playBackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: true,
      });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playBackObj, audio.uri);
      updateState(this.context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }
  };

  rowRenderer = (type, item, index, extendedState) => {
    // console.log(extendedState);
    return (
      <AudioListItems
        title={item.filename}
        duration={item.duration}
        onOptionPress={() => {
          this.controlModal(item);
        }}
        onAudioPress={() => this.handleAudioPress(item)}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          // console.log(dataProvider);
          return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
              <RecyclerListView
                rowRenderer={this.rowRenderer}
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                visible={this.state.optionModalVisible}
                onClose={this.controlModal}
                currentItem={this.state.currentItem}
                onPlayPress={() => {
                  console.log('Playing audio');
                }}
                onPlayListPress={() => {
                  console.log('adding to Playlist');
                }}
              />
            </View>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

export default AudioList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
