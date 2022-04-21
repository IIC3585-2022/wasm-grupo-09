import Module from "./partition.js";

Module().then(function (mymod) {
  mymod._partition([7, 3, 2, 1, 5, 4, 8], 7);
  // console.log(myPartition);
});
