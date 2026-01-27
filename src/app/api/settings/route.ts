import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        return NextResponse.json(gym);
    } catch (error) {
        console.error("[SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name } = body;

        if (!name) return new NextResponse("Name is required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const updatedGym = await prisma.gym.update({
            where: { id: gym.id },
            data: { name }
        });

        return NextResponse.json(updatedGym);
    } catch (error) {
        console.error("[SETTINGS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
