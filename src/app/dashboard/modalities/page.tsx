export const dynamic = "force-dynamic"

import { ModalityDialog } from "@/components/modalities/ModalityDialog"
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

async function getModalities(userId: string) {
    const gym = await prisma.gym.findFirst({
        where: { ownerId: userId }
    })

    if (!gym) return []

    return prisma.modality.findMany({
        where: { gymId: gym.id },
        orderBy: { createdAt: 'desc' }
    })
}

export default async function ModalitiesPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const modalities = await getModalities(session.user.id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Modalidades</h1>
                <ModalityDialog />
            </div>

            <div className="border rounded-lg shadow-sm overflow-x-auto">
                <Table className="min-w-[600px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Mensalidade</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {modalities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
                                    Nenhuma modalidade encontrada. Adicione uma para começar.
                                </TableCell>
                            </TableRow>
                        ) : (
                            modalities.map((modality) => (
                                <TableRow key={modality.id}>
                                    <TableCell className="font-medium">{modality.name}</TableCell>
                                    <TableCell>R$ {(modality.price || 0).toFixed(2)}</TableCell>
                                    <TableCell>{modality.description}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <ModalityDialog modality={modality}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </ModalityDialog>
                                            <DeleteButton id={modality.id} resource="modalities" />
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
