const crc32 = require('crc-32')

const simhash = (string) => {
  let V = []

  for (let i = 0; i < 32; ++i)
    V[i] = 0

  String.prototype.shingles = function (size) {
    let shingles = []

    for (let i = 0; i < this.length - size + 1; ++i)
      shingles.push(this.slice(i, i + size))

    return shingles
  }

  const shingles = string.shingles(2)
    .map(el => crc32.str(el))


  let hashes = shingles.map(hash => {
    hash = hash.toString(2)
    if (hash[0] === '-')
      return hash.slice(1)
    else
      return hash
  })

  hashes.forEach(hash => {
    hash.split('').map((bit, index) => bit * 1 === 1 ? V[index] += 1 : V[index] -= 1)
  });

  const result = V.map(el => el >= 1 ? 1 : 0).join('')

  return result
}

module.exports = simhash