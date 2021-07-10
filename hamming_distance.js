const hammingDistance = (a, b) => {
  let count = 0
  for(let i = 0; i < a.length; ++i)
    if (a[i] !== b[i]) count += 1

  return count
}

const jaccardCoefficient = (a, b) => {
  let countOfZeros = 0
  let countOfOnes = 0
  for(let i = 0; i < a.length; ++i) {
    if (a[i] == 0 && b[i] == 0) countOfZeros += 1
    else if (a[i] == 1 && b[i] == 1) countOfOnes += 1
  }

  return countOfOnes / (32 - countOfZeros)
}

module.exports = { hammingDistance, jaccardCoefficient }