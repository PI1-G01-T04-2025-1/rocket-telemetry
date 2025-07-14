-- CreateTable
CREATE TABLE "foguete" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "peso_zfw" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "lancamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foguete_id" INTEGER NOT NULL,
    "datahora" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "angulo" REAL NOT NULL DEFAULT 45.0,
    "pressao" REAL NOT NULL DEFAULT 0,
    "qtd_agua" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "lancamento_foguete_id_fkey" FOREIGN KEY ("foguete_id") REFERENCES "foguete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dadocoletado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lancamento_id" INTEGER NOT NULL,
    "raw_data" TEXT NOT NULL,
    "datahora" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dadocoletado_lancamento_id_fkey" FOREIGN KEY ("lancamento_id") REFERENCES "lancamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "foguete_nome_key" ON "foguete"("nome");
