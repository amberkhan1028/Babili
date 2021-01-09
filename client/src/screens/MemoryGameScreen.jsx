/* eslint-disable global-require */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import {
  Text, View, FlatList, Dimensions, Image,
} from 'react-native';
import { Button } from 'react-native-elements';

import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import MemoryGameHeader from '../components/MemoryGameHeader';
import PuzzleCard from '../components/MemoryGameCard';

import * as constant from '../components/constants';

const imageInModal = Dimensions.get('window').width / 1.5;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function MemoryGameScreen() {
  const [columns, setColumns] = useState(constant.START_LEVEL);
  const [rows, setRows] = useState(constant.START_LEVEL);

  const [images, setImages] = useState(constant.CreatePuzzles(columns * rows));
  const [puzzleStarted, setPuzzleStarted] = useState(false);
  const [puzzle, setPuzzle] = useState({});
  const [score, setScore] = useState(0);
  const [counter, setCounter] = useState(0);
  const [randomPuzzles, setRandomPuzzles] = useState(
    constant.GetRandomItemsFromArray(images, images.length),
  );
  const [gameOver, setGameOver] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  function startPuzzle() {
    setPuzzleStarted(true);
    showNextPuzzle();
  }

  function showNextPuzzle() {
    if (counter < randomPuzzles.length) {
      setPuzzle(randomPuzzles[counter]);
      setCounter((c) => c + 1);
    } else {
      setGameOver(true);
    }
  }

  useEffect(() => {
    onBackDrop();
  }, [columns, rows]);

  function onBackDrop() {
    setImages(constant.CreatePuzzles(columns * rows));
    setButtonDisabled(true);
    setPuzzleStarted(false);
    setPuzzle({});
    setScore(0);
    setCounter(0);
    setGameOver(false);
  }

  useEffect(
    () => {
      setButtonDisabled(!isAllImgsVisited());
      console.warn('Started');
    },
    [JSON.stringify(images)],
  );

  useEffect(
    () => {
      setRandomPuzzles(constant.GetRandomItemsFromArray(images, images.length));
    },
    [JSON.stringify(images.map((img) => img.id))],
  );

  useEffect(() => {
    setInfoModalVisible(true);
  }, []);

  function countScore(clickedCard) {
    if (!puzzleStarted) {
      setImages(
        images.map((img) => {
          if (img.id === clickedCard.id) return { ...img, visited: true };
          return img;
        }),
      );
      isAllImgsVisited();
      return null;
    }
    if (puzzle.id === clickedCard.id) {
      setScore((c) => c + 10);
      setTimeout(() => showNextPuzzle(), 400);
      return true;
    }
    setScore((c) => c - 5);
    return false;
  }

  function isAllImgsVisited() {
    let i;
    for (i = 0; i < images.length; i++) if (!images[i].visited) return false;
    return true;
  }

  return (
    <View style={{ flex: 1 }}>
      <MemoryGameHeader setColumns={setColumns} setRows={setRows} rows={rows} />

      <View style={{
        borderColor: 'lightgrey', borderRadius: 5, borderWidth: 1, margin: 3,
      }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 25,
            fontWeight: '200',
            padding: 5,
            color: '#fff',
          }}
        >
          Score:
          {' '}
          {score}
        </Text>
      </View>

      <FlatList
        data={images}
        key={columns * rows}
        numColumns={columns}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PuzzleCard card={item} countScore={countScore} gameOver={gameOver} columns={columns} />
        )}
      />

      {puzzleStarted && (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image
            resizeMode="contain"
            style={{
              width: '50%', height: '130%', alignSelf: 'center', marginBottom: 150,
            }}
            source={puzzle.name}
          />
        </View>
      )}

      {!puzzleStarted && (
        <Button
          buttonStyle={{ width: 80, alignSelf: 'center', marginBottom: 50 }}
          title="GO"
          disabled={buttonDisabled}
          onPress={() => (puzzleStarted ? '' : startPuzzle())}
        />
      )}

      <Modal isVisible={gameOver} onBackdropPress={() => onBackDrop()}>
        <View
          style={{
            flex: 0.6,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: Constants.statusBarHeight,
          }}
        >
          {score === rows * columns * 10 && (
            <>
              <Text>woohooo HIGH SCORE !!!!!</Text>
              <Image
                resizeMode="contain"
                source={constant.RandomElementFromArray(constant.winnerGIFs)}
                style={{ width: imageInModal, height: imageInModal }}
              />
            </>
          )}
          <Text style={{ fontSize: 30 }}>
            SCORE:
            {score}
          </Text>
        </View>
      </Modal>

      <Modal isVisible={infoModalVisible} onBackdropPress={() => setInfoModalVisible(false)}>
        <View
          style={{
            padding: 15,
            backgroundColor: '#fff',
            alignSelf: 'center',
            height: screenHeight / 2,
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 20 }}>
            Build stories to remember the pics
          </Text>
          <Image
            source={require('../../assets/logo.png')}
            resizeMode="contain"
            style={{
              marginTop: 20,
              marginBottom: 20,
              width: screenWidth,
              height: 160,
              alignSelf: 'center',
            }}
          />
          <View style={{ left: 50, marginBottom: 20 }}>
            <Text style={{ textAlign: 'left' }}> • Grandma saved Giraffe from Lion</Text>
            <Text style={{ textAlign: 'left' }}> • Gradma cooked spicyfood for Elsa </Text>
            <Text style={{ textAlign: 'left' }}> • It made her mouth so hot as sun</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
