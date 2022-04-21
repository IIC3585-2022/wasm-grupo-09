import Module from "./partition.js";

function parseInput() {
  let input = document.getElementById("input").value;
  input = JSON.parse(input);
  partitionate(input);
}
document.querySelector("button").addEventListener("click", parseInput);

function partitionate(input) {
  let n = input.length;
  Module().then(function (mymod) {
    let partition = mymod._partition(input, n);
    console.log(typeof partition);
  });
}
