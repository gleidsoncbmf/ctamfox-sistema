-- CreateTable
CREATE TABLE "_ClassSessionToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ClassSessionToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "ClassSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassSessionToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Modality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL DEFAULT 0,
    "gymId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Modality_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Modality" ("createdAt", "description", "gymId", "id", "name", "updatedAt") SELECT "createdAt", "description", "gymId", "id", "name", "updatedAt" FROM "Modality";
DROP TABLE "Modality";
ALTER TABLE "new_Modality" RENAME TO "Modality";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ClassSessionToStudent_AB_unique" ON "_ClassSessionToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassSessionToStudent_B_index" ON "_ClassSessionToStudent"("B");
