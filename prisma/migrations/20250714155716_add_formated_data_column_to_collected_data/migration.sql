/*
  Warnings:

  - You are about to drop the column `alturas` on the `dadocoletado` table. All the data in the column will be lost.
  - You are about to drop the column `posicoes` on the `dadocoletado` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dadocoletado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lancamento_id" INTEGER NOT NULL,
    "distancia" REAL,
    "tempo_de_percurso" REAL,
    "velocidade_media" REAL,
    "altura_maxima" REAL,
    "dados_formatados" TEXT,
    "raw_data" TEXT NOT NULL,
    "datahora" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dadocoletado_lancamento_id_fkey" FOREIGN KEY ("lancamento_id") REFERENCES "lancamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dadocoletado" ("altura_maxima", "datahora", "distancia", "id", "lancamento_id", "raw_data", "tempo_de_percurso", "velocidade_media") SELECT "altura_maxima", "datahora", "distancia", "id", "lancamento_id", "raw_data", "tempo_de_percurso", "velocidade_media" FROM "dadocoletado";
DROP TABLE "dadocoletado";
ALTER TABLE "new_dadocoletado" RENAME TO "dadocoletado";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
