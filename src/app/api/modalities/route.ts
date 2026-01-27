import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, price } = body;

        if (!name) return new NextResponse("Name is required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const modality = await prisma.modality.create({
            data: {
                name,
                description,
                price: price || 0,
                gymId: gym.id,
            },
        });

        return NextResponse.json(modality);
    } catch (error) {
        console.error("[MODALITY_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const modalities = await prisma.modality.findMany({
            where: { gymId: gym.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(modalities);
    } catch (error) {
        console.error("[MODALITY_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Modality ID is required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const modality = await prisma.modality.findFirst({
            where: { id, gymId: gym.id }
        });

        if (!modality) return new NextResponse("Modality not found", { status: 404 });

        // Check if there are any classes using this modality
        const classesCount = await prisma.classSession.count({
            where: { modalityId: id }
        });

        if (classesCount > 0) {
            return new NextResponse("Não é possível excluir esta modalidade pois existem turmas vinculadas a ela.", { status: 400 });
        }

        await prisma.modality.delete({
            where: { id }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[MODALITY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { id, name, description, price } = body;

        if (!id || !name) return new NextResponse("ID and Name are required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const existingModality = await prisma.modality.findFirst({
            where: { id, gymId: gym.id }
        });

        if (!existingModality) return new NextResponse("Modality not found", { status: 404 });

        const modality = await prisma.modality.update({
            where: { id },
            data: {
                name,
                description,
                price: price || 0,
            }
        });

        return NextResponse.json(modality);
    } catch (error) {
        console.error("[MODALITY_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
