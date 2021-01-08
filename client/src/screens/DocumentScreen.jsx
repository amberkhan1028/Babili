/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,

} from 'react-native';
import { Camera } from 'expo-camera';
import config from '../../../config';
import CameraPreview from '../components/CameraPreview';

const API_KEY = config.OCR;
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  translationView: {
    padding: 10,
    marginHorizontal: 20,
    height: '90%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#0f9535',
    marginBottom: 10,
    borderRadius: 10,
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
  const [, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(false);
  const [cameraType] = useState(Camera.Constants.Type.back);

  let camera = Camera;
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

  const startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === 'granted') {
      setStartCamera(true);
    } else {
      Alert.alert('Access denied');
    }
  };

  const takePictureAsync = async () => {
    const photo = await camera.takePictureAsync({ base64: true });
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const analyzePhoto = async () => {
    try {
      const result = await callGoogleVisionAsync(capturedImage.base64);
      setStatusAvail(true);
      setWord(result);
    } catch (error) {
      setWord(`Error: ${error.message}`);
    }
  };

  const loadNewTranslation = () => {
    setTranslation('');
  };
  const retakePhoto = async () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    setStatusAvail(true);
    loadNewTranslation();
    startCamera();
  };

  useEffect(() => {
    startCamera();
  }, []);

  const showResult = () => (
    <View style={styles.translationView}>
      {statusAvail ? (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Babili Text Detection</Text>
          </View>
          <Text style={{ fontSize: 40, marginBottom: 20, color: '#2E86ab' }}>{word}</Text>
          <Text style={{
            fontSize: 20, marginBottom: 50, color: '#f42B03', justifyContent: 'flex-end',
          }}
          >
            { translation }
          </Text>
          <Button color="#ffc857" title="Detect More Text!" onPress={() => retakePhoto()} />

        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {!translation ? (
        <View
          style={{
            flex: 1,
            width: '100%',
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={analyzePhoto}
              retakePicture={retakePhoto}
            />
          ) : (
            <Camera
              type={cameraType}
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r;
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity
                      onPress={takePictureAsync}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View style={styles.body}>{word && showResult()}</View>

      )}

      <StatusBar style="auto" />
    </View>

  );
}
