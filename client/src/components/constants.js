/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable global-require */
export const START_LEVEL = 3;

const ALL_IMAGES = [
  require('../../assets/baby.jpg'),
  require('../../assets/books.png'),
  require('../../assets/car.jpg'),
  require('../../assets/dog.jpg'),
  require('../../assets/hat.jpg'),
  require('../../assets/house.jpg'),
];

export const yayGIFs = [
  require('../../assets/yay1.gif'),
  require('../../assets/yay2.gif'),
  require('../../assets/gif-yay-3.gif'),
];

export const winnerGIFs = [
  require('../../assets/200.gif'),
  require('../../assets/giphy (1).gif'),
  require('../../assets/tenor.gif'),
];

export const bgImages = [
  'https://www.onlygfx.com/wp-content/uploads/2018/09/5-comic-burst-background-3.png',
  'https://www.onlygfx.com/wp-content/uploads/2018/07/4-red-watercolor-texture-background-4.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2019/02/9-gauze-texture-background-5.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2015/10/fabric-texture-black-2.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2016/11/grunge-coffee-stain-texture-1.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2020/05/blue-grunge-background-7.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2016/03/green-oil-paint.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2016/08/black-blue-abstract-paint-2.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2016/08/abstract-red-paint-2.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2016/02/green-paint.jpg',
  'https://www.onlygfx.com/wp-content/uploads/2018/03/acrylic-paint-abstract-texture-8.jpeg',
];

export function RandomElementFromArray(arr) {
  return arr[rand(arr.length)];
}

export function rand(max) {
  return Math.floor(Math.random() * max);
}

function isInArray(element, array) {
  let i;
  for (i = 0; i < array.length; i++) if (array[i] === element) return true;
  return false;
}

export function GetRandomItemsFromArray(allItems, count) {
  let i = 0; const
    randomItems = [];

  while (i < count) {
    const r = RandomElementFromArray(allItems);
    if (!isInArray(r, randomItems)) randomItems[i++] = r;
  }
  return randomItems;
}

export function RandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(rand(charactersLength));
  }
  return result;
}

export function CreatePuzzles(totalCards) {
  const arr = GetRandomItemsFromArray(ALL_IMAGES, totalCards);
  return arr.map((l) => ({
    name: l,
    hidden: true,
    visited: false,
    id: RandomString(6),
  }));
}
