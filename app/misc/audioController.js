// play audio
export const play = async (playBackObj, uri) => {
  try {
    return await playBackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log('Error from play helper', error.message);
  }
};

// pause audio
export const pause = async (playBackObj) => {
  try {
    return await playBackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log('Error from pause helper', error.message);
  }
};

// resume audio
export const resume = async (playBackObj) => {
  try {
    return await playBackObj.playAsync();
  } catch (error) {
    console.log('Error from resume helper', error.message);
  }
};

// select another audio
export const playNext = async (playBackObj, uri) => {
  try {
    await playBackObj.stopAsync();
    await playBackObj.unloadAsync();
    return await play(playBackObj, uri);
  } catch (error) {
    console.log('Error from playNext helper', error.message);
  }
};
