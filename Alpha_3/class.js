// ===================================================================
//  Douglas in the Galaxy — Alpha 3 : classes des entités
//  (hitbox tolérante, sprites mis à l'échelle de la case, difficulté
//   pilotée par le numéro de salle)
// ===================================================================

class Joueur {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.taille = tailleCarre;
        this.marge = Math.max(2, Math.round(tailleCarre * 0.16)); // tolérance de passage
        this.vitesse = Math.max(2, Math.round(tailleCarre / 9));
        this.vie = 3;
        this.vieMax = 5;
        this.attaque = 0;
        this.score = 0;
        this.fin = false;
        this.dead = false;
        this.invincible = 0;
        this.matrix = [
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffa200","#ffffff","#ffffff","#ffa200","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#000000","#000000","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#000000","#000000","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffa200","#ffffff","#ffffff","#ffa200","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#ffffff"],
            ["#000000","#ffffff","#ffffff","#000000","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#000000","#ffffff","#ffffff","#000000"],
            ["#000000","#ffffff","#ffffff","#000000","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#ffa200","#ffa200","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#000000","#ffffff","#ffffff","#000000"],
            ["#000000","#ffffff","#ffffff","#000000","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#ffa200","#ffa200","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#000000","#ffffff","#ffffff","#000000"],
            ["#ffffff","#ffffff","#ffffff","#000000","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#000000","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#000000","#000000","#99A3A4","#99A3A4","#99A3A4","#99A3A4","#000000","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#000000","#000000","#000000","#000000","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff"]
        ];
        this.img = initSprite(this.matrix);
    }

    bouger() {
        var v = this.vitesse;
        if (keyIsDown(RIGHT_ARROW) && !collisionMur(this.x + v, this.y, this.marge)) this.x += v;
        if (keyIsDown(LEFT_ARROW)  && !collisionMur(this.x - v, this.y, this.marge)) this.x -= v;
        if (keyIsDown(UP_ARROW)    && !collisionMur(this.x, this.y - v, this.marge)) this.y -= v;
        if (keyIsDown(DOWN_ARROW)  && !collisionMur(this.x, this.y + v, this.marge)) this.y += v;

        this.afficher();
        this.bords();
        this.mort();
        this.testEnnemis();
        this.testCoeur();
        this.testPNJ();
        if (this.fin == true) this.end();
    }

    afficher() {
        if (this.invincible > 0 && frameCount % 8 < 4) return;  // clignotement
        image(this.img, this.x, this.y, tailleCarre, tailleCarre);
    }

    // progression : bord droit -> salle suivante, bord gauche -> précédente.
    // On recale le joueur sur la case d'entrée pour éviter toute dérive.
    bords() {
        if (this.x + tailleCarre / 2 > canvasW) {
            if (niveauIndex < NB_NIVEAUX_JOUABLES) {
                niveauIndex++;
                Level = niveauIndex + 1;
                niveauActu = getNiveau(niveauIndex);
                initLev();
                this.x = tailleCarre;
                this.y = entryRow * tailleCarre;
            } else {
                this.x = canvasW - tailleCarre;
            }
            return;
        }
        if (this.x + tailleCarre / 2 < 0) {
            if (niveauIndex > 0) {
                niveauIndex--;
                Level = niveauIndex + 1;
                niveauActu = getNiveau(niveauIndex);
                initLev();
                this.x = (gridW - 2) * tailleCarre;
                this.y = entryRow * tailleCarre;
            } else {
                this.x = 0;
            }
            return;
        }
        if (this.y < 0) this.y = 0;
        if (this.y + tailleCarre > canvasH) this.y = canvasH - tailleCarre;
    }

    testEnnemis() {
        if (this.invincible > 0) this.invincible--;
        for (var i = 0; i < ennemiTab.length; i++) {
            if (this.chevauche(ennemiTab[i])) {
                if (this.attaque > 0) {
                    ennemiTab.splice(i, 1);
                    this.attaque -= 1;
                    this.score += 10;
                    i--;
                } else if (this.invincible <= 0) {
                    this.vie -= 1;
                    this.score = Math.max(0, this.score - 1);
                    this.invincible = 75;
                    this.recul(ennemiTab[i]);
                }
            }
        }
    }

    testCoeur() {
        for (var i = 0; i < coeurTab.length; i++) {
            if (coeurTab[i].actif && this.chevauche(coeurTab[i])) {
                if (this.vie < this.vieMax) this.vie += 1;
                coeurTab[i].actif = false;
                this.score += 5;
            }
        }
    }

    testPNJ() {
        for (var i = 0; i < pnjTab.length; i++) {
            var p = pnjTab[i];
            if (this.chevauche(p)) {
                if (p.type == "Arme") {
                    afficheBulle(p.direArme, p.x, p.y);
                    if (p.arme == true) {
                        this.attaque += 1;
                        p.arme = false;
                        this.score += 1;
                    }
                } else if (p.type == "Tuto") {
                    afficheBulle(p.direTuto, p.x, p.y);
                } else if (p.type == "Fin") {
                    pnjTab.splice(i, 1);
                    this.fin = true;
                }
            }
        }
    }

    end() {
        this.x = -1000;
        this.y = -1000;
        fill("#0f1054");
        rect(0, 0, canvasW, canvasH);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(Math.max(14, tailleCarre * 0.6));
        var joueurActu = prompt("Bravo ! Vous avez trouvé le Guide. Quel est votre pseudo ?");
        if (joueurActu) pseudo.push(joueurActu);
        text("Bravo " + joueurActu + " !\nVous avez traversé la galaxie.\nScore : " + this.score,
             canvasW / 2, canvasH / 2);
        textAlign(LEFT, BASELINE);
        menu = true;
    }

    mort() {
        if (this.vie < 1) {
            this.vie = 3;
            this.attaque = 0;
            this.score = 0;
            this.invincible = 0;
            niveauIndex = 0;
            Level = 1;
            niveauActu = getNiveau(0);
            this.dead = true;
            initLev();
            this.x = tailleCarre;
            this.y = entryRow * tailleCarre;
            menu = true;
        }
    }

    recul(en) {
        var dx = Math.sign(this.x - en.x);
        var dy = Math.sign(this.y - en.y);
        for (var p = 0; p < tailleCarre; p++) {
            if (dx != 0 && !collisionMur(this.x + dx, this.y, this.marge)) this.x += dx;
            if (dy != 0 && !collisionMur(this.x, this.y + dy, this.marge)) this.y += dy;
        }
    }

    chevauche(o) {
        return (this.x + this.taille > o.x &&
                this.y + this.taille > o.y &&
                this.x < o.x + tailleCarre &&
                this.y < o.y + tailleCarre);
    }
}

class Ennemi {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.marge = Math.max(2, Math.round(tailleCarre * 0.18));
        this.dir = "bas";
        this.matrix = [
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#000000","#ffffff","#C0392B","#C0392B","#000000","#000000","#C0392B","#C0392B","#ffffff","#000000","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#000000","#ffffff","#C0392B","#000000","#ffffff","#ffffff","#000000","#C0392B","#ffffff","#000000","#C0392B","#C0392B","#C0392B","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#C0392B","#C0392B","#C0392B","#C0392B","#ffffff"],
            ["#ffffff","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B"],
            ["#C0392B","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B"],
            ["#C0392B","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#000000","#C0392B","#C0392B","#000000","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#A04000","#C0392B"],
            ["#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B"],
            ["#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B"],
            ["#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B"],
            ["#ffffff","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#000000","#000000","#ffffff","#ffffff","#ffffff","#000000","#000000","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B"],
            ["#ffffff","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#000000","#000000","#000000","#000000","#000000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B"],
            ["#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#A04000","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#C0392B","#C0392B","#C0392B","#C0392B","#C0392B","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"]
        ];
        this.img = initSprite(this.matrix);
    }

    afficher() {
        image(this.img, this.x, this.y, tailleCarre, tailleCarre);
    }

    bouger() {
        // DIFFICULTÉ DRASTIQUE : en fin de partie les martiens vont PLUS VITE que
        // le joueur et le traquent de très loin -> il faut esquiver et désintégrer.
        var diff = Math.min(niveauIndex / (NB_NIVEAUX_JOUABLES - 1), 1);
        var vit = joueur.vitesse * (0.65 + 0.62 * diff);   // 0.65x -> 1.27x
        var detection = (6 + diff * 18) * tailleCarre;
        var d = dist(joueur.x, joueur.y, this.x, this.y);

        if (d < detection) this.versleJoueur(vit);
        else this.errer(vit);

        this.afficher();
        this.bords();
    }

    versleJoueur(vit) {
        if (this.x < joueur.x && !collisionMur(this.x + vit, this.y, this.marge)) this.x += vit;
        else if (this.x > joueur.x && !collisionMur(this.x - vit, this.y, this.marge)) this.x -= vit;
        if (this.y < joueur.y && !collisionMur(this.x, this.y + vit, this.marge)) this.y += vit;
        else if (this.y > joueur.y && !collisionMur(this.x, this.y - vit, this.marge)) this.y -= vit;
    }

    errer(vit) {
        if (frameCount % 35 == 0) this.dir = random(["haut", "bas", "gauche", "droite"]);
        if (this.dir == "haut"   && !collisionMur(this.x, this.y - vit, this.marge)) this.y -= vit;
        else if (this.dir == "bas"    && !collisionMur(this.x, this.y + vit, this.marge)) this.y += vit;
        else if (this.dir == "gauche" && !collisionMur(this.x - vit, this.y, this.marge)) this.x -= vit;
        else if (this.dir == "droite" && !collisionMur(this.x + vit, this.y, this.marge)) this.x += vit;
        else this.dir = random(["haut", "bas", "gauche", "droite"]);
    }

    bords() {
        this.x = constrain(this.x, 0, canvasW - tailleCarre);
        this.y = constrain(this.y, 0, canvasH - tailleCarre);
    }
}

class PNJ {
    constructor(x, y, typePNJ) {
        this.x = x;
        this.y = y;
        this.arme = true;
        this.type = typePNJ;          // "Arme" | "Tuto" | "Fin"
        this.phraseTuto = [
            "Bienvenue Voyageur Galactique. Attention aux martiens ! Avancez vers la droite de salle en salle.",
            "Ramassez les armes pour desintegrer les martiens, et les coeurs pour vous soigner."
        ];
        this.phraseArme = [
            "Desintegrez les martiens avec ca.",
            "Prenez ce bouclier desintegrateur.",
            "Cette technologie est tres avancee.",
            "Le capitaine a fait la guerre neptunienne.",
            "Avant j'etais un astrostoppeur."
        ];
        this.direArme = random(this.phraseArme);
        this.direTuto = random(this.phraseTuto);

        if (typePNJ == "Arme") this.img = initSprite(matrixArme);
        else if (typePNJ == "Tuto") this.img = initSprite(matrixTuto);
    }

    afficher() {
        if (this.type == "Arme" || this.type == "Tuto") {
            image(this.img, this.x, this.y, tailleCarre, tailleCarre);
        } else if (this.type == "Fin") {
            fill("#ffd24d");
            textAlign(CENTER, CENTER);
            textSize(Math.max(10, tailleCarre * 0.5));
            text("42", this.x + tailleCarre / 2, this.y + tailleCarre / 2);
            textSize(Math.max(9, tailleCarre * 0.4));
            text("Le Guide du Voyageur Galactique", this.x + tailleCarre / 2, this.y - tailleCarre * 0.6);
            textAlign(LEFT, BASELINE);
        }
    }
}

class Coeur {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.actif = true;
        this.img = initSprite(matrixCoeur);
    }
    afficher() {
        if (this.actif) image(this.img, this.x, this.y, tailleCarre, tailleCarre);
    }
}

// petite bulle de dialogue lisible quel que soit le zoom
function afficheBulle(txt, px, py) {
    push();
    textSize(Math.max(10, tailleCarre * 0.42));
    textAlign(LEFT, TOP);
    fill(255);
    text(txt, px - tailleCarre, py - tailleCarre * 1.6, tailleCarre * 5, tailleCarre * 3);
    pop();
}
