import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { AudioContext } from '../context';

export class AudioList extends Component {
  static contextType = AudioContext;

  render() {
    return (
      <ScrollView>
        {this.context.audioFiles.map((audio) => (
          <Text key={audio.id}>{audio.filename}</Text>
        ))}
      </ScrollView>
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
