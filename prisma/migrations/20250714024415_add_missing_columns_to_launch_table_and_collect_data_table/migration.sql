-- AlterTable
ALTER TABLE "dadocoletado" ADD COLUMN "altura_maxima" REAL;
ALTER TABLE "dadocoletado" ADD COLUMN "distancia" REAL;
ALTER TABLE "dadocoletado" ADD COLUMN "tempo_de_percurso" REAL;
ALTER TABLE "dadocoletado" ADD COLUMN "velocidade_media" REAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lancamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foguete_id" INTEGER NOT NULL,
    "datahora" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "angulo" REAL NOT NULL DEFAULT 45.0,
    "pressao" REAL NOT NULL DEFAULT 0,
    "qtd_agua" REAL NOT NULL DEFAULT 0,
    "distancia_esperada" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "lancamento_foguete_id_fkey" FOREIGN KEY ("foguete_id") REFERENCES "foguete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_lancamento" ("angulo", "datahora", "foguete_id", "id", "pressao", "qtd_agua") SELECT "angulo", "datahora", "foguete_id", "id", "pressao", "qtd_agua" FROM "lancamento";
DROP TABLE "lancamento";
ALTER TABLE "new_lancamento" RENAME TO "lancamento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
