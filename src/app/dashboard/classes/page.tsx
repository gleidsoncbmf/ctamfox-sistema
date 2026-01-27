export const dynamic = "force-dynamic"

import { ClassDialog } from "@/components/classes/ClassDialog"
import { DeleteButton } from "@/components/ui/DeleteButton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Pencil, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getData(userId: string) {
    const gym = await prisma.gym.findFirst({
        where: { ownerId: userId }
    })

    if (!gym) return { classes: [], modalities: [], professors: [] }

    const classes = await prisma.classSession.findMany({
        where: { gymId: gym.id },
        include: { modality: true, professor: true },
        orderBy: { createdAt: 'desc' }
    })

    const modalities = await prisma.modality.findMany({
        where: { gymId: gym.id },
        orderBy: { name: 'asc' }
    })

    const professors = await prisma.professor.findMany({
        where: { gymId: gym.id },
        orderBy: { name: 'asc' }
    })

    return { classes, modalities, professors }
}

export default async function ClassesPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const { classes, modalities, professors } = await getData(session.user.id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Turmas</h1>
                <ClassDialog modalities={modalities} professors={professors} />
            </div>

            <div className="border rounded-lg shadow-sm overflow-x-auto">
                <Table className="min-w-[600px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Horário</TableHead>
                            <TableHead>Modalidade</TableHead>
                            <TableHead>Professor</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    Nenhuma turma encontrada. Adicione uma para começar.
                                </TableCell>
                            </TableRow>
                        ) : (
                            classes.map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell className="font-medium">{cls.name}</TableCell>
                                    <TableCell>{cls.schedule}</TableCell>
                                    <TableCell>{cls.modality.name}</TableCell>
                                    <TableCell>{cls.professor.name}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center gap-2 flex-nowrap">
                                            <Link href={`/dashboard/students?classId=${cls.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" title="Ver Alunos">
                                                    <Users className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <ClassDialog modalities={modalities} professors={professors} classSession={cls}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </ClassDialog>
                                            <DeleteButton id={cls.id} resource="classes" />
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
