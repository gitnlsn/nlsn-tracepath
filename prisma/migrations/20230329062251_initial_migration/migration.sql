-- CreateTable
CREATE TABLE "TracepathHop" (
    "id" TEXT NOT NULL,
    "hop" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "rtt" DOUBLE PRECISION NOT NULL,
    "raw" TEXT NOT NULL,
    "tracepathReadId" TEXT NOT NULL,

    CONSTRAINT "TracepathHop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracepathRead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TracepathRead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TracepathHop" ADD CONSTRAINT "TracepathHop_tracepathReadId_fkey" FOREIGN KEY ("tracepathReadId") REFERENCES "TracepathRead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
