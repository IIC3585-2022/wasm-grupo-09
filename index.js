import Module from "./partition.js";
import JSPartition from "./JSPartition.js";

const isInputValid = (input) => {
  if (!input.includes(',')) {
    return false;
  };
  let splitInput = input.split(',')
  for (let i = 0; i < splitInput.length; i++) {
    if (isNaN(splitInput[i]) || splitInput[i] === '') {
      return false;
    };
  };
  return true;
};

const showInputError = () => {
  $('#numbers-array').val('');
  $("#input-group").after(
    "<p id='error' class='text-danger'>Ingresa un input válido</p>"
  );
};

// Sets the arrayPtr to the module
const makePtrArray = (myModule, input) => {
  const arrayPtr = myModule._malloc(4 * input.length);
  for (let i = 0; i < input.length; i++) {
    myModule.setValue(arrayPtr + i * 4, parseInt(input[i]), "i32");
  }
  return arrayPtr;
};

// Sets the subsets to the module
const makeSubsetsPtr = (myModule, input) => {
  const subset1Ptr = myModule._malloc(4 * (input.length - 2));
  const subset2Ptr = myModule._malloc(4 * (input.length - 2));
  const subset3Ptr = myModule._malloc(4 * (input.length - 2));
  for (let i = 0; i < input.length - 2; i++) {
    myModule.setValue(subset1Ptr + i * 4, -1, "i32");
    myModule.setValue(subset2Ptr + i * 4, -1, "i32");
    myModule.setValue(subset3Ptr + i * 4, -1, "i32");
  }
  return [subset1Ptr, subset2Ptr, subset3Ptr];
};

// Makes the Ptrs for the module function
const makePtrs = (myModule, input) => {
  const arrayPtr = makePtrArray(myModule, input);
  const [subset1Ptr, subset2Ptr, subset3Ptr] = makeSubsetsPtr(myModule, input);
  return [arrayPtr, subset1Ptr, subset2Ptr, subset3Ptr];
};

// Gets the subsets Ptr from the module
const getSubsetFromPtr = (myModule, subsetPtr, input) => {
  let subset = [];
  for (let i = 0; i < input.length - 2; i++) {
    subset.push(myModule.getValue(subsetPtr + i * 4, "i32"));
  }
  return subset.filter((value) => value !== -1);
};

// Gets the subsets results from the function
const getSubsets = (myModule, subset1Ptr, subset2Ptr, subset3Ptr, input) => {
  let subsets = [];
  subsets.push(getSubsetFromPtr(myModule, subset1Ptr, input));
  subsets.push(getSubsetFromPtr(myModule, subset2Ptr, input));
  subsets.push(getSubsetFromPtr(myModule, subset3Ptr, input));
  return subsets;
};

const showWASMTime = (time) => {
  $("#wasm-time").text(`${Math.floor(time * 10000) / 10000} ms`);
};

const showJSTime = (time) => {
  $("#js-time").text(`${Math.floor(time * 10000) / 10000} ms`);
};

const cleanResults = () => {
  $('#error').remove();
  $("#results").empty();
};

const showPartition = (subset, i) => {
  let result = $("#results");
  let subsetNumbers = "";
  for (let i = 0; i < subset.length; i++) {
    subsetNumbers += `<p class='h4 p-2'>${subset[i]}</p>`;
  }
  let partitionDiv = `<div id='partition${i}' class='d-flex flex-wrap p-5 justify-content-center'>${subsetNumbers}</div>`;
  result.append(partitionDiv);
};

const showError = () => {
  let result = $("#results");
  let errorDiv = "<p id='error' class='h3'>No hay una combinación de 3</p>";
  result.append(errorDiv);
};

Module().then(function (mymod) {
  $("#button").click(() => {
    cleanResults();
    let input = $("#numbers-array").val();
    if (!isInputValid(input)) {
      showInputError();
      return;
    }
    input = JSON.parse(`[${input}]`);
    const [arrayPtr, subset1Ptr, subset2Ptr, subset3Ptr] = makePtrs(
      mymod,
      input
    );
    let partition = mymod.cwrap("partition", "number", [
      "number",
      "number",
      "number",
      "number",
      "number",
    ]);
    const wasmStartTime = performance.now();
    let result = partition(
      arrayPtr,
      input.length,
      subset1Ptr,
      subset2Ptr,
      subset3Ptr
    );
    const wasmEndTime = performance.now();
    showWASMTime(wasmEndTime - wasmStartTime);
    let jsSubset1 = [];
    let jsSubset2 = [];
    let jsSubset3 = [];
    let jsResult = JSPartition(
      input,
      input.length,
      jsSubset1,
      jsSubset2,
      jsSubset3
    );
    console.log(jsResult);
    console.log([jsSubset1, jsSubset2, jsSubset3]);
    const jsEndTime = performance.now();
    showJSTime(jsEndTime - wasmEndTime);
    if (result === 1) {
      let subsets = getSubsets(
        mymod,
        subset1Ptr,
        subset2Ptr,
        subset3Ptr,
        input
      );
      showPartition(subsets[0], 0);
      showPartition(subsets[1], 1);
      showPartition(subsets[2], 2);
    } else {
      showError();
    }
  });
});
