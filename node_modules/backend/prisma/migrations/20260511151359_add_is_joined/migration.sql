-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isJoined" BOOLEAN NOT NULL DEFAULT false,
    "collectedWater" INTEGER NOT NULL DEFAULT 0,
    "contributedWater" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("collectedWater", "contributedWater", "createdAt", "division", "id", "isAdmin", "name", "pin", "score") SELECT "collectedWater", "contributedWater", "createdAt", "division", "id", "isAdmin", "name", "pin", "score" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_pin_key" ON "User"("pin");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
