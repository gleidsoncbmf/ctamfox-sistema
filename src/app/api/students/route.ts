import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, email, phone, paymentStatus, classIds } = body;

        if (!name) return new NextResponse("Name is required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        const student = await prisma.student.create({
            data: {
                name,
                email,
                phone,
                paymentStatus: paymentStatus || "ACTIVE",
                gymId: gym.id,
                classes: {
                    connect: classIds?.map((id: string) => ({ id })) || []
                }
            },
            include: {
                classes: {
                    include: { modality: true }
                }
            }
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error("[STUDENT_POST]", error);
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

        const students = await prisma.student.findMany({
            where: { gymId: gym.id },
            include: {
                classes: {
                    include: { modality: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error("[STUDENT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Student ID is required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        // Verify student belongs to gym
        const student = await prisma.student.findFirst({
            where: { id, gymId: gym.id }
        });

        if (!student) return new NextResponse("Student not found", { status: 404 });

        await prisma.student.delete({
            where: { id }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[STUDENT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { id, name, email, phone, paymentStatus, classIds } = body;

        if (!id || !name) return new NextResponse("ID and Name are required", { status: 400 });

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!gym) return new NextResponse("Gym not found", { status: 404 });

        // Verify student belongs to gym
        const existingStudent = await prisma.student.findFirst({
            where: { id, gymId: gym.id }
        });

        if (!existingStudent) return new NextResponse("Student not found", { status: 404 });

        const student = await prisma.student.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                paymentStatus,
                classes: {
                    set: [], // Dissociate all existing classes
                    connect: classIds?.map((classId: string) => ({ id: classId })) || []
                }
            },
            include: {
                classes: {
                    include: { modality: true }
                }
            }
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error("[STUDENT_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
