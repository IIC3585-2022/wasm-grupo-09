class Subset {
  constructor() {
    this.len = 0;
    this.numbers = [];
  }
}

class Answer {
  constructor(partition) {
    this.partition = partition;
    this.subsets = new Array(3);
    this.msg = "";
  }
}

function accumulate(S, n) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += S[i];
  }
  return sum;
}

function isSubsetExists(S, n, a, b, c, arr) {
  if (a == 0 && b == 0 && c == 0) {
    return 1;
  }
  if (n < 0) {
    return 0;
  }
  let A = 0;
  if (a - S[n] >= 0) {
    arr[n] = 1;
    A = isSubsetExists(S, n - 1, a - S[n], b, c, arr);
  }
  let B = 0;
  if (!A && b - S[n] >= 0) {
    arr[n] = 2;
    B = isSubsetExists(S, n - 1, a, b - S[n], c, arr);
  }
  let C = 0;
  if (!A && !B && c - S[n] >= 0) {
    arr[n] = 3;
    C = isSubsetExists(S, n - 1, a, b, c - S[n], arr);
  }
  return A || B || C;
}

function partition(S, n, subset1, subset2, subset3) {
  let sum = accumulate(S, n);
  let arr = new Array(S.length);
  let result =
    n >= 3 &&
    sum % 3 == 0 &&
    isSubsetExists(S, n - 1, sum / 3, sum / 3, sum / 3, arr);
  let answer = new Answer(result);
  if (result) {
    for (let i = 0; i < 3; i++) {
      answer.subsets[i] = new Subset();
      for (let j = 0; j < n; j++) {
        if (arr[j] == i + 1) {
          answer.subsets[i].len++;
        }
      }
      let k = 0;
      for (let j = 0; j < n; j++) {
        if (arr[j] == i + 1) {
          answer.subsets[i].numbers[k] = S[j];
          if (i == 0) {
            subset1[k] = S[j];
          }
          if (i == 1) {
            subset2[k] = S[j];
          }
          if (i == 2) {
            subset3[k] = S[j];
          }
          k++;
        }
      }
    }
  }
  answer.msg = "3-partition of set is not posible\n";
  if (!answer.partition) {
    answer.msg = "3-partition of set is posible\n";
    return 0;
  } else {
    return 1;
  }
}
function mainV2() {
  let S = [7, 3, 2, 1, 5, 4, 8];
  let n = S.length;
  let subset1 = new Array(3);
  let subset2 = new Array(3);
  let subset3 = new Array(3);
  let result = partition(S, n, subset1, subset2, subset3);
  console.log("%d %d\n", subset1[0], subset1[1]);
  if (!result) {
    console.log("No \n");
  } else {
    for (let i = 0; i < 3; i++) {
      console.log("partition %d:", i);
      for (let j = 0; j < 3; j++) {
        if (i == 0) {
          console.log("%d ", subset1[j]);
        }
        if (i == 1) {
          console.log("%d ", subset2[j]);
        }
        if (i == 2) {
          console.log("%d ", subset3[j]);
        }
      }
      console.log("\n");
    }
  }
  return 0;
}

mainV2();