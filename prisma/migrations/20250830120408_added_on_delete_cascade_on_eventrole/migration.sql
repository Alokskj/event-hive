-- DropForeignKey
ALTER TABLE "EventRole" DROP CONSTRAINT "EventRole_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventRole" DROP CONSTRAINT "EventRole_userId_fkey";

-- DropEnum
DROP TYPE "DiscountType";

-- DropEnum
DROP TYPE "RefundStatus";

-- AddForeignKey
ALTER TABLE "EventRole" ADD CONSTRAINT "EventRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRole" ADD CONSTRAINT "EventRole_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
