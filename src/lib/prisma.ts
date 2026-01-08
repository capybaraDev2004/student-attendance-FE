// prisma client helper tránh tạo nhiều instance khi hot-reload trong Next.js
// Lưu ý: Prisma Client được generate vào `src/generated/prisma` theo schema
// nên cần import từ đường dẫn này thay vì `@prisma/client`.
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ["error", "warn"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
