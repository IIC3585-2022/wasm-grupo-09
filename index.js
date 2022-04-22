import Module from "./partition.js";

// Sets the arrayPtr to the module
const makePtrArray = (myModule, input) => {
  const arrayPtr = myModule._malloc(4 * input.length);
  for (let i = 0; i < input.length; i++) {
    myModule.setValue(arrayPtr + i * 4, parseInt(input[i]), "i32");
  };
  return arrayPtr;
};

// Sets the subsets to the module
const makeSubsetsPtr = (myModule, input) => {
  const subset1Ptr = myModule._malloc(4 * (input.length - 2));
  const subset2Ptr = myModule._malloc(4 * (input.length - 2));
  const subset3Ptr = myModule._malloc(4 * (input.length - 2));
  for (let i = 0; i < input.length - 2; i++) {
    myModule.setValue(subset1Ptr + (i * 4), 0, "i32");
    myModule.setValue(subset2Ptr + (i * 4), 0, "i32");
    myModule.setValue(subset3Ptr + (i * 4), 0, "i32");
  };
  return [subset1Ptr, subset2Ptr, subset3Ptr];
};

// Makes the Ptrs for the module function
const makePtrs = (myModule, input) => {
  const arrayPtr = makePtrArray(myModule, input);
  const [
    subset1Ptr,
    subset2Ptr,
    subset3Ptr
  ] = makeSubsetsPtr(myModule, input);
  return [arrayPtr, subset1Ptr, subset2Ptr, subset3Ptr];
};

// Gets the subsets Ptr from the module
const getSubsetFromPtr = (myModule, subsetPtr, input) => {
  let subset = [];
  for (let i = 0; i < input.length - 2; i++){
    subset.push(myModule.getValue(subsetPtr + (i * 4), "i32")); 
  };
  return subset.filter((value) => value !== 0);
};

// Gets the subsets results from the function
const getSubsets = (myModule, subset1Ptr, subset2Ptr, subset3Ptr, input) => {
  let subsets = [];
  subsets.push(getSubsetFromPtr(myModule, subset1Ptr, input));
  subsets.push(getSubsetFromPtr(myModule, subset2Ptr, input));
  subsets.push(getSubsetFromPtr(myModule, subset3Ptr, input));
  return subsets;
};

Module().then(function (mymod) {
  document.querySelector("button").addEventListener("click", () => {
    let input = document.getElementById("input").value;
    input = JSON.parse(`[${input}]`);
    const [
      arrayPtr,
      subset1Ptr,
      subset2Ptr,
      subset3Ptr
    ] = makePtrs(mymod, input);
    let partition = mymod.cwrap(
      'partition',
      'number',
      ['number', 'number', 'number', 'number', 'number']
    );
    let result = partition(
      arrayPtr,
      input.length,
      subset1Ptr, 
      subset2Ptr, 
      subset3Ptr
    );
    if (result === 1) {
      let subsets = getSubsets(mymod, subset1Ptr, subset2Ptr, subset3Ptr, input);
      console.log(subsets);
    }
    else {
      console.log('No hay una combinación de 3');
    };
  });
});
