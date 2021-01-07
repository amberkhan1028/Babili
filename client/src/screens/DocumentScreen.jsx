/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  ActivityIndicator,

} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import config from '../../../config';

const API_KEY = config.OCR;
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  translationView: {
    marginTop: 30,
    padding: 20,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    height: 500,
  },
  body: {
    padding: 5,
    paddingTop: 25,
  },
  header: {
    backgroundColor: '#0f9535',
  },
  title: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default function DocumentScreen() {
  const [translation, setTranslation] = useState('');
  const [language] = useState('es');
  const [word, setWord] = useState(null);
  const [statusAvail, setStatusAvail] = useState(false);
  const GoogleTranslateAPI = 'https://translation.googleapis.com/language/translate/v2';
  const GoogleAPIKey = config.OCR;

  const getTranslation = async (className) => {
    try {
      const googleTranslateApiEndpoint = `${GoogleTranslateAPI}?q=${className}&target=${language}&format=html&source=en&model=nmt&key=${GoogleAPIKey}`;
      const apiCall = await fetch(googleTranslateApiEndpoint);
      if (!apiCall) {
        console.error('Google API did not respond adequately. Review API call.');
        setTranslation('Cannot get transaction at this time. Please try again later');
      }

      const response = await apiCall.json();
      if (
        !response.data
        || !response.data.translations
        || response.data.translations.length === 0
      ) {
        console.error(`Google API unexpected response. ${response}`);
        setTranslation('Cannot get translation at this time. Please try again later');
      }
      setTranslation(response.data.translations[0].translatedText);
    } catch (error) {
      console.error(`Error while attempting to get translation from Google API. Error: ${error}`);
      setTranslation('Cannot get translation at this time. Please try again later');
    }
  };

  const getBlockText = (block) => {
    let results = '';
    block.paragraphs.forEach((paragraph) => {
      paragraph.words.forEach((char) => {
        char.symbols.forEach((symbol) => {
          results += symbol.text;
          if (symbol.property && symbol.property.detectedBreak) {
            const breakType = symbol.property.detectedBreak.type;
            if (['EOL_SURE_SPACE', 'SPACE'].includes(breakType)) {
              results += ' ';
            }
            if (['EOL_SURE_SPACE', 'LINE_BREAK'].includes(breakType)) {
              results += '\n'; // Perhaps use os.EOL for correctness.
            }
          }
        });
      });
    });

    return results;
  };

  const getTextBlocks = (visionResults) => {
    let textBlocks = [];
    // eslint-disable-next-line prefer-const
    let blockIndex = 0;
    visionResults.forEach((result) => {
      result.fullTextAnnotation.pages.forEach((page) => {
        textBlocks = textBlocks.concat(page.blocks.map((block) => ({
          blockIndex: blockIndex + 1,
          text: getBlockText(block),
        })));
      });
    });
    return textBlocks;
  };

  async function callGoogleVisionAsync(pic) {
    const body = {
      requests: [
        {
          image: {
            content: pic,
          },
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    const value = getTextBlocks(result.responses);
    await getTranslation(value[0].text);
    return value[0].text;
  }

  const takePictureAsync = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === 'granted') {
      const { cancelled, base64 } = await ImagePicker.launchCameraAsync({
        base64: true,
      });
      if (!cancelled) {
        setWord('Loading...');
        try {
          const result = await callGoogleVisionAsync(base64);
          setStatusAvail(true);
          setWord(result);
        } catch (error) {
          setWord(`Error: ${error.message}`);
        }
      } else {
        setWord(null);
      }
    } else {
      Alert.alert('Access denied');
    }
  };

  useEffect(() => {
    takePictureAsync();
  }, []);

  const loadNewTranslation = () => {
    setTranslation('');
  };

  const showResult = () => (
    <View style={styles.translationView}>
      {statusAvail ? (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Babili Text Detection</Text>
          </View>
          <Text fontSize="50" marginBottom="40" color="#2E86ab">{word}</Text>
          <Text style={styles.translationTextField}>{translation}</Text>
          <Button color="#ffc857" title="Take Another Picture" onPress={() => { setStatusAvail(false); takePictureAsync(); loadNewTranslation(); }} />
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <>
        <View style={styles.body}>
          {word && showResult()}
        </View>
      </>
    </View>
  );
}
