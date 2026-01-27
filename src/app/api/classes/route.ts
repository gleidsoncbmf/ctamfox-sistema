import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, schedule, modalityId, professorId } = body;

        if (!name || !modalityId || !professorId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const classSession = await prisma.classSession.create({
            data: {
                name,
                schedule: schedule || "",
                modalityId,
                professorId,
                gymId: gym.id,
            },
        });

        return NextResponse.json(classSession);
    } catch (error) {
        console.error("[CLASS_POST]", error);
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

        const classes = await prisma.classSession.findMany({
            where: { gymId: gym.id },
            include: {
                modality: true,
                professor: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(classes);
    } catch (error) {
        console.error("[CLASS_GET]", error);
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

        const classSession = await prisma.classSession.findFirst({
            where: { id, gymId: gym.id }
        });

        if (!classSession) return new NextResponse("Class not found", { status: 404 });

        // Check if there are any students in this class
        const studentsCount = await prisma.student.count({
            where: {
                classes: {
                    some: {
                        id
                    }
                }
            }
        });

        if (studentsCount > 0) {
            return new NextResponse("Não é possível excluir esta turma pois existem alunos matriculados nela.", { status: 400 });
        }

        await prisma.classSession.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("[CLASS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { id, name, schedule, modalityId, professorId } = body;

        if (!id || !name || !modalityId || !professorId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const existingClass = await prisma.classSession.findFirst({
            where: { id, gymId: gym.id }
        });

        if (!existingClass) return new NextResponse("Class not found", { status: 404 });

        const classSession = await prisma.classSession.update({
            where: { id },
            data: {
                name,
                schedule: schedule || "",
                modalityId,
                professorId,
            },
        });

        return NextResponse.json(classSession);
    } catch (error) {
        console.error("[CLASS_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
