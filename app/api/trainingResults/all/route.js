import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const results = await prisma.trainingResult.findMany({
            include: { trainee: true },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ success: true, results }),
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error fetching all results:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500 }
        );
    }
}