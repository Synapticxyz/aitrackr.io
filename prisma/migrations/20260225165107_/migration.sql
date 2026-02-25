-- CreateTable
CREATE TABLE "tool_suggestions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "url" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tool_suggestions_user_id_idx" ON "tool_suggestions"("user_id");

-- AddForeignKey
ALTER TABLE "tool_suggestions" ADD CONSTRAINT "tool_suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
