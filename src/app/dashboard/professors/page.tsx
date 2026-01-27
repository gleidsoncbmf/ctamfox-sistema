export const dynamic = "force-dynamic"

import { ProfessorDialog } from "@/components/professors/ProfessorDialog"
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
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getProfessors(userId: string) {
    const gym = await prisma.gym.findFirst({
        where: { ownerId: userId }
    })

    if (!gym) return []

    return prisma.professor.findMany({
        where: { gymId: gym.id },
        orderBy: { createdAt: 'desc' }
    })
}

export default async function ProfessorsPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const professors = await getProfessors(session.user.id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Professores</h1>
                <ProfessorDialog />
            </div>

            <div className="border rounded-lg shadow-sm overflow-x-auto">
                <Table className="min-w-[600px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Especialidade</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {professors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
                                    Nenhum professor encontrado. Adicione um para começar.
                                </TableCell>
                            </TableRow>
                        ) : (
                            professors.map((prof) => (
                                <TableRow key={prof.id}>
                                    <TableCell className="font-medium">{prof.name}</TableCell>
                                    <TableCell>{prof.specialty}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center gap-2 flex-nowrap">
                                            <ProfessorDialog professor={prof}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </ProfessorDialog>
                                            <DeleteButton id={prof.id} resource="professors" />
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
