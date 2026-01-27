export const dynamic = "force-dynamic"

import { StudentDialog } from "@/components/students/StudentDialog"
import { DeleteButton } from "@/components/ui/DeleteButton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StudentFilter } from "@/components/students/StudentFilter"

interface StudentsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getData(userId: string, classId?: string, status?: string) {
    const gym = await prisma.gym.findFirst({
        where: { ownerId: userId }
    })

    if (!gym) return { students: [], classes: [] }

    const where: any = { gymId: gym.id }

    if (classId && classId !== "all") {
        where.classes = {
            some: {
                id: classId
            }
        }
    }

    if (status) {
        where.paymentStatus = status
    }

    const students = await prisma.student.findMany({
        where,
        include: {
            classes: {
                include: {
                    modality: true
                }
            }
        },
        orderBy: { name: 'asc' }
    })

    const classes = await prisma.classSession.findMany({
        where: { gymId: gym.id },
        include: { modality: true },
        orderBy: { name: 'asc' }
    })

    return { students, classes }
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const params = await searchParams
    const classId = typeof params.classId === 'string' ? params.classId : undefined
    const status = typeof params.status === 'string' ? params.status : undefined
    const { students, classes } = await getData(session.user.id, classId, status)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'default' // primary
            case 'LATE': return 'destructive' // red
            case 'INACTIVE': return 'secondary' // gray
            default: return 'outline'
        }
    }

    const translateStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Ativo'
            case 'LATE': return 'Atrasado'
            case 'INACTIVE': return 'Inativo'
            default: return status
        }
    }

    // Helper to calculate total price
    const calculateTotal = (studentClasses: any[]) => {
        return studentClasses.reduce((acc, cls: any) => acc + (cls.modality.price || 0), 0)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Alunos</h1>
                <div className="flex items-center gap-2">
                    <StudentFilter classes={classes} />
                    <StudentDialog classes={classes as any} />
                </div>
            </div>

            <div className="border rounded-lg shadow-sm overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Mensalidade</TableHead>
                            <TableHead>Turmas</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    Nenhum aluno encontrado{classId ? " nesta turma" : ""}.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student: any) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>R$ {calculateTotal(student.classes).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {student.classes.map((cls: any) => (
                                                <Badge key={cls.id} variant="outline" className="text-xs w-fit">
                                                    {cls.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{student.email}</div>
                                        <div className="text-xs text-gray-500">{student.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(student.paymentStatus) as any}>
                                            {translateStatus(student.paymentStatus)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center gap-2 flex-nowrap">
                                            <StudentDialog classes={classes as any} student={student as any} />
                                            <DeleteButton id={student.id} resource="students" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
