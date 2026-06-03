// ===================================================================
//  Douglas in the Galaxy — Alpha 3
//  100 salles générées procéduralement (difficulté croissante),
//  grande map responsive, rendu des murs pré-calculé, collisions
//  tolérantes, défilement clavier neutralisé.
// ===================================================================

// --- réglages généraux ---
var gridW = 35;                           // largeur de la grille (impair => labyrinthe propre)
var gridH = 21;                           // hauteur de la grille (rectangle paysage)
var NB_NIVEAUX_JOUABLES = 10;             // salles avant le Guide
var entryRow = 2 * Math.floor(gridH / 4) + 1;  // ligne d'entrée/sortie (impaire, centrée)

// --- dimensions (calculées dans setup, responsives) ---
var tailleCarre = 30;
var canvasW = tailleCarre * gridW;
var canvasH = tailleCarre * gridH;

// --- état du jeu ---
var joueur;
var ennemiTab = [];
var pnjTab = [];
var coeurTab = [];
var menu = true;
var pseudo = [];
var niveauIndex = 0;
var Level = 1;
var niveauActu;
var niveauxCache = [];                    // labyrinthes générés (mémorisés)
var etoiles = [];

// --- murs : grille booléenne (collision) + calque pré-rendu (affichage) ---
var murGrid = [];
var murLayer;
var murSprite;

var infos, scoreBoard;

// ===================================================================
//  SPRITES (matrices ; "#ffffff" = transparent)
// ===================================================================
function initSprite(matrix) {
  var img = createImage(matrix[0].length, matrix.length);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      if (matrix[j][i] != "#ffffff") img.set(i, j, color(matrix[j][i]));
      else img.set(i, j, color(0, 0, 0, 0));
    }
  }
  img.updatePixels();
  return img;
}

// mur en briques bleues
var matrixMur = [
  ["#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB"],
  ["#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6"],
  ["#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4"],
  ["#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4"],
  ["#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4"],
  ["#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4"],
  ["#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#2874A6","#3498DB","#3498DB","#2874A6","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4"],
  ["#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#3498DB","#3498DB","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4"],
  ["#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#3498DB","#3498DB","#3498DB","#3498DB","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6"],
  ["#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB"],
  ["#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB","#3498DB"],
  ["#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#3498DB","#3498DB","#3498DB","#3498DB","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6"],
  ["#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#3498DB","#3498DB","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4"],
  ["#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#2874A6","#3498DB","#3498DB","#2874A6","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4"],
  ["#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4"],
  ["#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4"],
  ["#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4"],
  ["#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6","#99A3A4"],
  ["#2874A6","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#2874A6"],
  ["#3498DB","#2874A6","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB","#3498DB","#2874A6","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#2874A6","#3498DB"]
];

// pistolet désintégrateur (arme)
var matrixArme = [
  ["#ffffff","#ffffff","#ffffff","#000000","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#000000","#2874A6","#2874A6","#2874A6","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#000000","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#000000","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#2874A6","#000000","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#F1948A","#F1948A","#F1948A","#F1948A","#F1948A","#F1948A","#F1948A","#F1948A","#F1948A","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#F1948A","#F1948A","#000000","#000000","#E59866","#E59866","#E59866","#000000","#000000","#F1948A","#F1948A","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#F1948A","#000000","#ffffff","#ffa200","#000000","#E59866","#000000","#ffa200","#ffffff","#000000","#F1948A","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#F1948A","#E59866","#000000","#000000","#E59866","#E59866","#E59866","#000000","#000000","#F1948A","#F1948A","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#F1948A","#E59866","#E59866","#E59866","#E59866","#E59866","#E59866","#F1948A","#F1948A","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#000000","#000000","#000000","#000000","#000000","#000000","#F1948A","#F1948A","#F1948A","#F1948A","#F1948A","#F1948A","#F1948A","#000000","#000000","#000000","#000000","#000000","#ffffff","#ffffff"],
  ["#000000","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#000000","#ffffff","#ffffff"],
  ["#000000","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#000000","#ffffff","#ffffff"],
  ["#000000","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#000000","#ffffff","#ffffff"],
  ["#000000","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#000000","#ffffff","#ffffff"],
  ["#000000","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#000000","#ffffff","#ffffff"],
  ["#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffa200","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#ffa200","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffa200","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#ffa200","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffa200","#ffa200","#ffa200","#000000","#000000","#ffa200","#ffa200","#ffa200","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"]
];

// PNJ tuto (variante de l'arme avec une étincelle)
var matrixTuto = matrixArme;

// coeur de soin
var matrixCoeur = [
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#C0392B","#C0392B","#ffffff","#ffffff","#C0392B","#C0392B","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#C0392B","#C0392B","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#E74C3C","#E74C3C","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#E74C3C","#E74C3C","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"]
];

// ===================================================================
//  GÉNÉRATION PROCÉDURALE DES SALLES
//  Légende : 0 vide, 1 mur, 2 martien, 3 arme, 4 tuto, 6 guide, 7 coeur
// ===================================================================

// labyrinthe parfait (backtracker) ouvert selon la difficulté
function genererMaze(difficulte) {
  var W = gridW, H = gridH;
  var g = [];
  for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(1); }

  var stack = [[1, 1]];
  g[1][1] = 0;
  var dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]];
  while (stack.length) {
    var cur = stack[stack.length - 1];
    var cx = cur[0], cy = cur[1];
    var nb = [];
    for (var k = 0; k < 4; k++) {
      var nx = cx + dirs[k][0], ny = cy + dirs[k][1];
      if (nx > 0 && nx < W - 1 && ny > 0 && ny < H - 1 && g[ny][nx] === 1)
        nb.push([nx, ny, cx + dirs[k][0] / 2, cy + dirs[k][1] / 2]);
    }
    if (nb.length) {
      var p = nb[Math.floor(random(nb.length))];
      g[p[1]][p[0]] = 0;
      g[p[3]][p[2]] = 0;
      stack.push([p[0], p[1]]);
    } else stack.pop();
  }

  // ouverture : on enlève des murs intérieurs (un peu en facile, presque rien en difficile)
  var prob = (1 - difficulte) * 0.30;
  for (var y2 = 1; y2 < H - 1; y2++)
    for (var x2 = 1; x2 < W - 1; x2++)
      if (g[y2][x2] === 1 && random() < prob) g[y2][x2] = 0;

  // couloir d'entrée (gauche) et de sortie (droite) sur la ligne d'entrée
  g[entryRow][0] = 0;
  g[entryRow][1] = 0;
  g[entryRow][W - 1] = 0;
  g[entryRow][W - 2] = 0;
  return g;
}

function genererNiveau(index) {
  var diff = index / (NB_NIVEAUX_JOUABLES - 1);
  var g = genererMaze(diff);

  // cellules libres exploitables (hors couloirs d'entrée/sortie)
  var pool = [];
  for (var y = 1; y < gridH - 1; y++)
    for (var x = 2; x < gridW - 2; x++)
      if (g[y][x] === 0) pool.push([x, y]);

  // DIFFICULTÉ DRASTIQUE : nuée de martiens, armes/coeurs rares
  var nbEnnemis = 6 + Math.round(diff * 38);              // 6 -> 44
  poser(g, pool, nbEnnemis, 2, 5);                        // au moins 5 cases du spawn

  var nbArmes = 1 + Math.floor(diff * 2);                 // 1 -> 3 (rares)
  poser(g, pool, nbArmes, 3, 0);

  var nbCoeurs = Math.floor(diff * 2);                    // 0 -> 1 (très rares)
  poser(g, pool, nbCoeurs, 7, 0);

  if (index === 0) {                                      // tuto en salle 1, collé au spawn
    g[entryRow][2] = 0;                                   // pocket ouvert relié à l'entrée
    g[entryRow][3] = 4;
  }
  return g;
}

// place n entités de valeur "val" sur des cellules libres du pool
function poser(g, pool, n, val, distMin) {
  var placed = 0, garde = 0;
  while (placed < n && garde < pool.length * 4 && pool.length > 0) {
    garde++;
    var idx = Math.floor(random(pool.length));
    var c = pool[idx];
    if (g[c[1]][c[0]] !== 0) { pool.splice(idx, 1); continue; }
    if (distMin > 0 && (Math.abs(c[0] - 1) + Math.abs(c[1] - entryRow)) < distMin) continue;
    g[c[1]][c[0]] = val;
    pool.splice(idx, 1);
    placed++;
  }
}

// salle finale : grande pièce ouverte avec le Guide au centre
function genererFin() {
  var W = gridW, H = gridH, g = [];
  for (var y = 0; y < H; y++) {
    g.push([]);
    for (var x = 0; x < W; x++)
      g[y].push((x === 0 || y === 0 || x === W - 1 || y === H - 1) ? 1 : 0);
  }
  g[entryRow][0] = 0;
  g[Math.floor(H / 2)][Math.floor(W / 2)] = 6;
  return g;
}

function getNiveau(index) {
  if (niveauxCache[index]) return niveauxCache[index];
  var g = (index >= NB_NIVEAUX_JOUABLES) ? genererFin() : genererNiveau(index);
  niveauxCache[index] = g;
  return g;
}

// ===================================================================
//  CHARGEMENT D'UNE SALLE : grille de collision + calque + entités
// ===================================================================
function initLev() {
  ennemiTab = [];
  pnjTab = [];
  coeurTab = [];
  murGrid = [];

  murLayer.clear();
  murLayer.noSmooth();

  var g = niveauActu;
  for (var y = 0; y < gridH; y++) {
    murGrid.push([]);
    for (var x = 0; x < gridW; x++) {
      var v = g[y][x];
      murGrid[y].push(v === 1);
      var px = x * tailleCarre, py = y * tailleCarre;
      if (v === 1) murLayer.image(murSprite, px, py, tailleCarre, tailleCarre);
      else if (v === 2) ennemiTab.push(new Ennemi(px, py));
      else if (v === 3) pnjTab.push(new PNJ(px, py, "Arme"));
      else if (v === 4) pnjTab.push(new PNJ(px, py, "Tuto"));
      else if (v === 6) pnjTab.push(new PNJ(px, py, "Fin"));
      else if (v === 7) coeurTab.push(new Coeur(px, py));
    }
  }
}

// collision murs avec hitbox rétrécie (marge) ; hors-grille = libre (transitions)
function collisionMur(nx, ny, marge) {
  var ax1 = nx + marge, ay1 = ny + marge;
  var ax2 = nx + tailleCarre - marge - 1, ay2 = ny + tailleCarre - marge - 1;
  var c1 = Math.floor(ax1 / tailleCarre), c2 = Math.floor(ax2 / tailleCarre);
  var r1 = Math.floor(ay1 / tailleCarre), r2 = Math.floor(ay2 / tailleCarre);
  for (var r = r1; r <= r2; r++) {
    if (r < 0 || r >= gridH) continue;
    for (var c = c1; c <= c2; c++) {
      if (c < 0 || c >= gridW) continue;
      if (murGrid[r][c]) return true;
    }
  }
  return false;
}

// ===================================================================
//  DIVERS
// ===================================================================
function updateScoreBoard() {
  return pseudo.join(", ");
}

function initEtoiles() {
  etoiles = [];
  var n = Math.floor((canvasW + canvasH) / 12);
  for (var i = 0; i < n; i++)
    etoiles.push({ x: random(canvasW), y: random(canvasH), r: random(0.5, 1.8), v: random(0.1, 0.6) });
}

function dessineEtoiles() {
  noStroke();
  for (var i = 0; i < etoiles.length; i++) {
    var e = etoiles[i];
    fill(255, 255, 255, 170);
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
    e.y += e.v;
    if (e.y > canvasH) { e.y = 0; e.x = random(canvasW); }
  }
}

function calcTaille() {
  // on réserve la place de l'en-tête, du HUD et du texte d'aide (≈ 230 px)
  var cW = (window.innerWidth - 30) / gridW;
  var cH = (window.innerHeight - 230) / gridH;
  tailleCarre = Math.max(12, Math.floor(Math.min(cW, cH)));
  canvasW = tailleCarre * gridW;
  canvasH = tailleCarre * gridH;
}

// ===================================================================
//  SETUP / DRAW
// ===================================================================
function setup() {
  calcTaille();
  frameRate(60);
  var cnv = createCanvas(canvasW, canvasH);
  cnv.parent("game");
  noStroke();
  noSmooth();                 // pixels nets même agrandis
  textFont('monospace');

  murSprite = initSprite(matrixMur);
  murLayer = createGraphics(canvasW, canvasH);

  joueur = new Joueur(tailleCarre, entryRow * tailleCarre);
  initEtoiles();
  niveauActu = getNiveau(0);
  initLev();

  var main = document.querySelector("main");
  infos = createDiv(""); infos.class("hud"); infos.parent(main);
  scoreBoard = createDiv(""); scoreBoard.class("hud"); scoreBoard.parent(main);
}

function draw() {
  if (!menuAffiche()) return;

  // fond qui se teinte du bleu (facile) vers le rouge (difficile)
  var diff = Math.min(niveauIndex / (NB_NIVEAUX_JOUABLES - 1), 1);
  background(lerpColor(color("#0d1024"), color("#2a0c12"), diff));
  dessineEtoiles();
  image(murLayer, 0, 0);

  // HUD
  textAlign(LEFT, BASELINE);
  var salle = (niveauIndex >= NB_NIVEAUX_JOUABLES) ? "★ Finale" : (Level + "/" + NB_NIVEAUX_JOUABLES);
  infos.html("Salle " + salle + " &nbsp;|&nbsp; ❤ " + joueur.vie +
             " &nbsp;|&nbsp; Points : " + joueur.score +
             " &nbsp;|&nbsp; Armes : " + joueur.attaque);
  scoreBoard.html("🏆 Vainqueurs : " + updateScoreBoard());

  for (var i = 0; i < coeurTab.length; i++) coeurTab[i].afficher();
  for (var i = 0; i < pnjTab.length; i++) pnjTab[i].afficher();
  for (var i = 0; i < ennemiTab.length; i++) ennemiTab[i].bouger();
  joueur.bouger();
}

// neutralise le défilement de la page avec les flèches
function keyPressed() {
  if ([LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].indexOf(keyCode) !== -1) return false;
}

// ===================================================================
//  MENUS
// ===================================================================
function reinit(versDepart) {
  joueur.x = tailleCarre;
  joueur.y = entryRow * tailleCarre;
  joueur.vie = 3;
  joueur.attaque = 0;
  joueur.score = 0;
  joueur.invincible = 0;
  joueur.fin = false;
  joueur.dead = false;
  niveauIndex = 0;
  Level = 1;
  niveauActu = getNiveau(0);
  initLev();
  menu = false;
}

function menuAffiche() {
  textAlign(CENTER, CENTER);
  textSize(Math.max(13, tailleCarre * 0.5));

  if (menu == true && joueur.fin == false && joueur.dead != true) {
    background("#05060f");
    dessineEtoiles();
    image(joueur.img, canvasW / 2 - canvasH / 4, canvasH * 0.08, canvasH / 2, canvasH / 2);
    fill(255);
    text("DOUGLAS IN THE GALAXY", canvasW / 2, canvasH * 0.68);
    textSize(Math.max(11, tailleCarre * 0.42));
    text("10 salles, de plus en plus mortelles, vous separent du Guide.\nAppuyez sur Entrée pour commencer.", canvasW / 2, canvasH * 0.80);
    textAlign(LEFT, BASELINE);
    if (keyIsDown(13)) reinit(true);
    return false;
  }

  if (menu == true && joueur.fin == true) {
    fill(255);
    text("Appuyez sur Entrée pour rejouer", canvasW / 2, canvasH / 2);
    textAlign(LEFT, BASELINE);
    if (keyIsDown(13)) reinit(true);
    return false;
  }

  if (menu == true && joueur.dead == true) {
    background("#0f1054");
    dessineEtoiles();
    fill(255);
    text("Vous êtes mort dans la galaxie...\nAppuyez sur Entrée pour recommencer", canvasW / 2, canvasH / 2);
    textAlign(LEFT, BASELINE);
    if (keyIsDown(13)) reinit(true);
    return false;
  }

  textAlign(LEFT, BASELINE);
  return true;
}
