const fs = require('fs')
const simhash = require('./simhash')
const { hammingDistance, jaccardCoefficient } = require('./hamming_distance')


let a = fs.readFileSync('./samples/franceinfo').toString()
let b = fs.readFileSync('./samples/lexpress').toString()

a = simhash(a)
b = simhash(b)

console.log(`Similarite tres elevee entre 2 articles traitant d'un evenement au Mexique\n Hamming distance: ${hammingDistance(a, b)}\n Coefficient de Jaccard: ${jaccardCoefficient(a, b)}`)

a = fs.readFileSync('./samples/bootstrap').toString()
b = fs.readFileSync('./samples/vue').toString()

a = simhash(a)
b = simhash(b)

console.log(`\nSimilarite tres faible 2 framework frontend (JS, CSS)\n Hamming distance: ${hammingDistance(a, b)}\n Coefficient de Jaccard: ${jaccardCoefficient(a, b)}`)






