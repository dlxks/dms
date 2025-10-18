-- CreateTable
CREATE TABLE "defense_required_documents" (
    "id" TEXT NOT NULL,
    "defenseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "DefenseCategory" NOT NULL,
    "description" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "defense_required_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "defense_required_documents" ADD CONSTRAINT "defense_required_documents_defenseId_fkey" FOREIGN KEY ("defenseId") REFERENCES "defense_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
