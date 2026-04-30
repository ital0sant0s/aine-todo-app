-- CreateTable
CREATE TABLE "todos" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "todos_created_at_idx" ON "todos"("created_at" DESC);
