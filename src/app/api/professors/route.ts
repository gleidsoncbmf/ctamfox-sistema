import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, specialty } = body;

        if (!name) return new NextResponse("Name is required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const professor = await prisma.professor.create({
            data: {
                name,
                specialty,
                gymId: gym.id,
            },
        });

        return NextResponse.json(professor);
    } catch (error) {
        console.error("[PROFESSOR_POST]", error);
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

        const professors = await prisma.professor.findMany({
            where: { gymId: gym.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(professors);
    } catch (error) {
        console.error("[PROFESSOR_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("ID required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const professor = await prisma.professor.findFirst({
            where: { id, gymId: gym.id }
        });

        if (!professor) return new NextResponse("Professor not found", { status: 404 });

        // Check if there are any classes using this professor
        const classesCount = await prisma.classSession.count({
            where: { professorId: id }
        });

        if (classesCount > 0) {
            return new NextResponse("Não é possível excluir este professor pois existem turmas vinculadas a ele.", { status: 400 });
        }

        await prisma.professor.delete({
            where: { id }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[PROFESSOR_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { id, name, specialty } = body;

        if (!id || !name) return new NextResponse("ID and Name required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const existingProfessor = await prisma.professor.findFirst({
            where: { id, gymId: gym.id }
        });

        if (!existingProfessor) return new NextResponse("Professor not found", { status: 404 });

        const professor = await prisma.professor.update({
            where: { id },
            data: {
                name,
                specialty,
            },
        });

        return NextResponse.json(professor);
    } catch (error) {
        console.error("[PROFESSOR_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
