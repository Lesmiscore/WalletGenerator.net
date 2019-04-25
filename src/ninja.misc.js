const getQueryString = function() {
  const result = {},
    queryString = location.search.substring(1),
    re = /([^&=]+)=([^&]*)/g;
  let m;
  while ((m = re.exec(queryString))) {
    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return result;
};

// use when passing an Array of Functions
const runSerialized = function(functions, onComplete) {
  onComplete = onComplete || function() {};

  if (functions.length === 0) onComplete();
  else {
    // run the first function, and make it call this
    // function when finished with the rest of the list
    setTimeout(() => {
      const f = functions.shift();
      f(function() {
        runSerialized(functions, onComplete);
      });
    }, 0);
  }
};

const forSerialized = function(initial, max, whatToDo, onComplete) {
  onComplete = onComplete || function() {};

  if (initial === max) {
    onComplete();
  } else {
    // same idea as runSerialized
    setTimeout(() => {
      whatToDo(initial, function() {
        forSerialized(++initial, max, whatToDo, onComplete);
      });
    }, 0);
  }
};

// use when passing an Object (dictionary) of Functions
const foreachSerialized = function(collection, whatToDo, onComplete) {
  const keys = [];
  for (const name in collection) {
    if ({}.hasOwnProperty.call(collection, name)) {
      keys.push(name);
    }
  }
  setTimeout(() => {
    forSerialized(
      0,
      keys.length,
      function(i, callback) {
        whatToDo(keys[i], callback);
      },
      onComplete
    );
  }, 0);
};

export { getQueryString, runSerialized, forSerialized, foreachSerialized };
