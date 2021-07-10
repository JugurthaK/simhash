class: center, middle

# SimHash Algorithm


## 1. SimHash et SEO

La technique SimHash créée par Moses Charikar est la méthode utilisée par Google afin de détecter le contenu dupliqué, facteur important dans l’indexation des sites internet par le moteur de recherche.

C’est cette technique qui est privilégiée car c’est l’une des plus flexible et efficace, elle est souvent mise en comparaison avec MinHash qui a une plus grande precision de detection que SimHash, neanmoins elle reste plus lente.



## 2. Explications mathematiques

Fonctions de hashage.

Elles peuvent prendre n'importe quelle chaîne binaire en entrée et produisent une chaîne binaire de taille fixe.

Propriétés:
	-	Pas de réciproque; à partir du hash on ne peut pas revenir en arrière.
	-	Résistante aux collisions 
	
Aujourd'hui les fonctions que l'on doit utiliser sont : SHA-2 et SHA-3

Regardons plus précisémment la construction de Merkle-Damgård:



#### A. LSH (Locally Sensitive Hashing)

Soit F une famille de fonctions hash.
Soit h une fonction quelconque appartenant à F. Soient p et q deux points quelconques appartenant à M (espace métrique)
Soit R>0 et c>1

Si d(p,q) <= R alors P[h(p)=h(q)] >= P1
Si d(p,q) >= cR alors P[h(p)=h(q)] <= P2

Par construction les fonctions de hashage doivent permettre aux points proches d'entrer fréquemment en collision (ie: h(p)=h(q)) et inversemment

Comment détecter des documents presques identiques:
-	générer du hash code à k bit
-	insérer le document dans la table de hash
-	collision => duplicata possible
-	comparer aux textes dans le même bucket



###### Explications

1. On veut des fonctions hash similaires pour les points proches.
2. On va générer des hyperplans aléatoires: h1, h2 et h3
3. Hash function pour a: H[a^Th1 a^Th2 a^Th3] = 100
4. Comparer a avec des points avec les mêmes fonctions hash
5. Répéter avec des hyperplans différents: h4, h5, h6

Coût : 
	-	N points, D-dimmension, K hyperplans. 
	-	DK trouve le bucket où les points atterissent. 
	-	N/2^k nbre de points dans ce bucket. 
	-	DN/2^k le coût des comparaisons
	-	Répéter L fois.
ce qui nous donne :
	-	LSH: LDK + LDN/2^k -> O(log N) si k ~ log N
	-	index : D (ND)/√(ND) -> O(√N)
	-	force brute : DN -> O(N)



Pour résumer lorsque deux textes sont identiques avec une probilité élevée on obtient dans le plan :
	
	avec x -> h(x)
	et x' -> h(x) , h étant une fonction de hashage
	
	nous obtenons :
	
	|[distance (h(x),h(x'))/distance (x,x')] - 1| <= ε




#### B. Dans le cas de SimHash

Un cas particulier du LSH:
	-	Pas besoin de conserver les hyperplans
	-	Par conséquence plus rapide 
Fonctionnement :
	-	attribuer aux mots des 'poids'
	-	calculer un unique b-bit hash pour chaque mot 
	-	convertir les 0 en -1 et mutiplier par le poids du mot.
	
Soit S et S' deux ensembles, on détermine le coefficient de Jacquard par: 

	d(S,S') = |S inter S'|/|S union S'|
	
avec une permutation de tous les éléments possibles dans ce domaine

	S -> π^-1(min(π(S)) avec π, permutation 
	Appelons cette fonction h(S)



Ce qui nous donne la probabilité suivante:
	
	P[h(S) = h(S')] = d(S,S') ; soit le coefficient de Jacquard
	
On peut effectuer l'approximation suivante où on ne prends pas le plus petit mais le cas le plus petit avec :
	
	S -> π^-1(mink(π(S)) avec mink est désormais le plus petit cas.
	Appelons cette fonction Shingle(S)
	
On peut alors admettre que pour chaque singleton Shingle i (S) et docID(S) existent. 
Lorsque qu'on rejoint les deux éléments : {(Shingle i (S), docID(S))} et on trie par Shingle i

Et enfin on détermine que les documents qui sont identiques ou presque vont avoir les mêmes singletons Shingle i.



## 3. Notre implementation de SimHash en JS

#### A. Creation des Shingles

`Un shingles est le decoupage d'une ensemble de mots en sous-ensemble de n lettres`

```js
String.prototype.shingles = function (size) {
  let shingles = []

  for (let i = 0; i < this.length - size + 1; ++i)
    shingles.push(this.slice(i, i + size))

  return shingles
}

const phrase = "The cat sat on Mat"
console.log(phrase.shingles(2))

/* returns ['th', 'he', 'e ', ' c', 'ca', 'at', 't ', ' s','sa', 'at', 't ', ' o','on', 'n ', ' M', 'Ma','at'] */
```


#### B. Hashage des Shingles en utilisant l'algorithme crc-32

```js
const shingles = string.shingles(2)
    .map(el => crc32.str(el))
```
#### C. Transformation des hash en valeur binaire

```js
let hashes = shingles.map(hash => {
  hash = hash.toString(2)
  if (hash[0] === '-')
    return hash.slice(1)
  else
    return hash
```
#### D. Construction du vecteur V

```js
  hashes.forEach(hash => {
    hash.split('').map((bit, index) => bit * 1 === 1 ? V[index] += 1 : V[index] -= 1)
  });
```



#### E. Construction de la valeur binaire a partir de V

```js
const result = V.map(el => el >= 1 ? 1 : 0)
```

Pour la phrase `the cat sat on mat` nous obtenons la valeur suivante : `11010110101011101111101101000100`

##### F. Calcul de la distance de Hamming

```js
const hammingDistance = (a, b) => {
  let count = 0
  for(let i = 0; i < a.length; ++i)
    if (a[i] !== b[i]) count += 1

  return count
}
```


#### G. Coefficient de Jaccard

Le coefficient de Jaccard ce calcul en utilisant la formule suivante:

<img src="https://latex.codecogs.com/svg.image?J(A,B)=\frac{(A\cap&space;B)}{(A\cup&space;B)}" title="J(A,B)=\frac{(A\cap B)}{(A\cup B)}" />



```js
const jaccardCoefficient = (a, b) => {
  let countOfZeros = 0
  let countOfOnes = 0
  for(let i = 0; i < a.length; ++i) {
    if (a[i] == 0 && b[i] == 0) countOfZeros += 1
    else if (a[i] == 1 && b[i] == 1) countOfOnes += 1
  }

  return countOfOnes / (32 - countOfZeros)
}
```

`Petite demo de code`