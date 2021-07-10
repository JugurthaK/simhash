class: center, middle

# SimHash Algorithm

---

## 1. SimHash et SEO

La technique SimHash créée par Moses Charikar est la méthode utilisée par Google afin de détecter le contenu dupliqué, facteur important dans l’indexation des sites internet par le moteur de recherche.

C’est cette technique qui est privilégiée car c’est l’une des plus flexible et efficace, elle est souvent mise en comparaison avec MinHash qui a une plus grande precision de detection que SimHash, neanmoins elle reste plus lente.

---

## 2. Notre implementation de SimHash en JS

### A. Creation des Shingles

`Un shingles est le decoupage d'une ensemble de mots en sous-ensemble de n mots`

```js
String.prototype.shingles = function (size) {
  let shingles = []

  for (let i = 0; i < this.length - size + 1; ++i)
    shingles.push(this.slice(i, i + size))

  return shingles
}

const phrase = "The cat sat on Mat"
console.log(phrase.shingles(2))

/* returns [
  'th', 'he', 'e ', ' c',
  'ca', 'at', 't ', ' s',
  'sa', 'at', 't ', ' o',
  'on', 'n ', ' M', 'Ma',
  'at'
] */
```