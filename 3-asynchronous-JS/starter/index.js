const fs = require('fs');
const superagent = require('superagent');

// Callbacks:
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   if (err) return console.error(`Error: ${err.message}`);

//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.error(`Error: ${err.message}`);

//       console.log(res.body.message);

//       fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, (err) => {
//         if (err) return console.error(`Error: ${err.message}`);

//         console.log('Random dog image saved to file!');
//       });
//     });
// });

// Promises:

// Building promises:
const readFilePromisified = fileName => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const writeFilePromisified = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, err => {
      err ? reject(err) : resolve();
    });
  });
};

// Consuming promises with then() and catch():
// readFilePromisified(`${__dirname}/dog.txt`)
//   .then(data => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then(res => {
//     console.log(res.body.message);

//     return writeFilePromisified(`${__dirname}/dog-img.txt`, res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog image saved to file!');
//   })
//   .catch(err => {
//     console.error(`Error: ${err.message}`);
//   });

// Consuming promises with async/await:
const getDogPics = async () => {
  try {
    const dogBreed = await readFilePromisified(`${__dirname}/dog.txt`);
    console.log(`Breed: ${dogBreed}`);

    const imageResponses = await Promise.all([
      superagent.get(`https://dog.ceo/api/breed/${dogBreed}/images/random`),
      superagent.get(`https://dog.ceo/api/breed/${dogBreed}/images/random`),
      superagent.get(`https://dog.ceo/api/breed/${dogBreed}/images/random`),
    ]);

    const imageUrls = imageResponses.map(res => res.body.message);
    console.log(imageUrls);

    await writeFilePromisified(
      `${__dirname}/dog-img.txt`,
      imageUrls.join('\n')
    );
    console.log('Random dog images saved to file!');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    throw err;
  }

  return '2: Done getting dog pics';
};

// With then() and catch():
// console.log('1: Will get dog pics');
// getDogPics().then(res => {
//   console.log(res);
// }).catch(err => {
//   console.error(`ERROR`);
// });

// With async/await:
console.log('1: Will get dog pics');
(async () => {
  try {
    console.log(await getDogPics());
  } catch (err) {
    console.error(`ERROR ^`);
  }
})();
