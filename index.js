import Module from "./partition.js";

Module().then(function(mymod) {
  console.log(mymod._partition([1, 5,4, 8], 4));
  console.log(mymod)
});
