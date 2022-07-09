import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../misc/colors';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';

const { width } = Dimensions.get('window');

const Player = () => {
  const audioContext = useContext(AudioContext);

  const { playbackPosition, playbackDuration } = audioContext;

  // console.log(audioContext);

  const calculateSeebBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  const scrollMaxValue = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackDuration;
    }
    return 1;
  };

  const scrollMinValue = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.audioCount}>{`${
        audioContext.currentAudioIndex + 1
      } / ${audioContext.totalAudioCount}`}</Text>
      <View style={styles.midBannerContainer}>
        <MaterialCommunityIcons
          name='music-circle'
          size={300}
          color={audioContext.isPlaying ? colors.ACTIVE_BG : colors.FONT_MEDIUM}
        />
      </View>
      <View style={styles.audioPlayerContainer}>
        <Text numberOfLines={1} style={styles.audioTitle}>
          {audioContext.currentAudio.filename}
        </Text>
        <Slider
          style={{ width: width, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeebBar()}
          onValueChange={(value) => console.log(value)}
          minimumTrackTintColor={colors.FONT_MEDIUM}
          maximumTrackTintColor={colors.ACTIVE_BG}
        />
        <View style={styles.audioControllers}>
          <PlayerButton iconType='PREV' />
          <PlayerButton
            onPress={() => console.log('playing')}
            style={{ marginHorizontal: 45 }}
            iconType={audioContext.isPlaying ? 'PLAY' : 'PAUSE'}
          />
          <PlayerButton iconType='NEXT' />
        </View>
      </View>
    </View>
  );
};

export default Player;

const styles = StyleSheet.create({
  audioControllers: {
    width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  audioCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: 'right',
    color: colors.FONT_LIGHT,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    color: colors.FONT,
    padding: 15,
  },
  audioPlayerContainer: {},
});
