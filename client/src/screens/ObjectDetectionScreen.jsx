import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Button,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

import config from '../../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#E8E8E8',
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
  body: {
    padding: 5,
    paddingTop: 25,
  },
  cameraView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    paddingTop: 15,
    paddingRight: 30,
  },
  camera: {
    width: 700 / 2,
    height: 800 / 2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
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
  translationTextField: {
    fontSize: 50,
    marginBottom: 40,
    color: '#2E86ab',
  },
  wordTextField: {
    textAlign: 'right',
    fontSize: 17,
    color: '#f42B03',
  },
  legendTextField: {
    fontStyle: 'italic',
    color: '#888888',
    textAlign: 'center',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'purple',
    borderStyle: 'solid',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff',
  },
});

export default function ObjectDetectionScreen() {
  const [translation, setTranslation] = useState('');
  const [word, setWord] = useState('');
  const [language] = useState('es');
  const [translationAvailable, setTranslationAvailable] = useState(false);
  const [predictionFound, setPredictionFound] = useState(false);
  const [, setHasPermission] = useState(null);

  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [frameworkReady, setFrameworkReady] = useState(false);
  const GoogleTranslateAPI = 'https://translation.googleapis.com/language/translate/v2';
  const GoogleAPIKey = config.OCR;

  const TensorCamera = cameraWithTensors(Camera);
  let requestAnimationFrameId = 0;
  const textureDims = Platform.OS === 'ios' ? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
  const tensorDims = { width: 152, height: 200 };
  const loadMobileNetModel = async () => {
    const model = await mobilenet.load();
    return model;
  };

  useEffect(() => {
    if (!frameworkReady) {
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        await tf.ready();

        setMobilenetModel(await loadMobileNetModel());

        setFrameworkReady(true);
      })();
    }
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(requestAnimationFrameId);
    },
    [requestAnimationFrameId],
  );

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
      setWord(className);
    } catch (error) {
      console.error(`Error while attempting to get translation from Google API. Error: ${error}`);
      setTranslation('Cannot get translation at this time. Please try again later');
    }

    setTranslationAvailable(true);
  };

  const getPrediction = async (tensor) => {
    if (!tensor) {
      return;
    }
    const prediction = await mobilenetModel.classify(tensor, 1);

    if (!prediction || prediction.length === 0) {
      return;
    }

    if (prediction[0].probability > 0.2) {
      cancelAnimationFrame(requestAnimationFrameId);
      setPredictionFound(true);
      await getTranslation(prediction[0].className);
    }
  };

  const handleCameraStream = (imageAsTensors) => {
    const loop = async () => {
      const nextImageTensor = await imageAsTensors.next().value;
      await getPrediction(nextImageTensor);
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    if (!predictionFound) loop();
  };

  const loadNewTranslation = () => {
    setTranslation('');
    setWord('');
    setPredictionFound(false);
    setTranslationAvailable(false);
  };

  const showTranslationView = () => (
    <View style={styles.translationView}>
      {translationAvailable ? (
        <View>
          <ScrollView style={{ height: 400 }}>
            <Text style={styles.translationTextField}>{word}</Text>
            <Text style={styles.wordTextField}>{translation}</Text>
          </ScrollView>
          <Button color="#ffc857" title="Check new word" onPress={() => loadNewTranslation()} />
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );

  const renderCameraView = () => (
    <View style={styles.cameraView}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        zoom={0}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={tensorDims.height}
        resizeWidth={tensorDims.width}
        resizeDepth={3}
        onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
        autorender
      />
      <Text style={styles.legendTextField}>
        Point to any object and get its translation
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Babili Pictionary</Text>
      </View>

      <View style={styles.body}>
        {translationAvailable ? showTranslationView() : renderCameraView()}
      </View>
    </View>
  );
}
