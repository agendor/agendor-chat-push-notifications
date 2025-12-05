-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "tokens" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "account_id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "device_id" VARCHAR(255) NOT NULL,
    "fcm_token" VARCHAR(512) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tokens_account_id_idx" ON "tokens"("account_id");

-- CreateIndex
CREATE INDEX "tokens_user_id_idx" ON "tokens"("user_id");

-- CreateIndex
CREATE INDEX "tokens_device_id_idx" ON "tokens"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_fcm_token_key" ON "tokens"("fcm_token");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_tokens_account_user_device" ON "tokens"("account_id", "user_id", "device_id");
