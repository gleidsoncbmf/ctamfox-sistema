export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getStats(userId: string) {
    // Find the gym first
    const gym = await prisma.gym.findFirst({
        where: { ownerId: userId }
    })

    if (!gym) return null

    const studentCount = await prisma.student.count({
        where: { gymId: gym.id }
    })

    const latePayments = await prisma.student.count({
        where: { gymId: gym.id, paymentStatus: 'LATE' }
    })

    const classes = await prisma.classSession.findMany({
        where: { gymId: gym.id },
        include: {
            _count: {
                select: { students: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return { studentCount, latePayments, gymName: gym.name, classes }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const stats = await getStats(session.user.id)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Visão Geral</h1>
            </div>

            {stats ? (
                <div className="flex flex-col gap-6">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        <Link href="/dashboard/students">
                            <Card className="hover:bg-gray-50 transition cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.studentCount}</div>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/dashboard/students?status=LATE">
                            <Card className="hover:bg-red-50 hover:border-red-200 transition cursor-pointer h-full border-l-4 border-l-red-500">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-red-700">Pagamentos Atrasados</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">{stats.latePayments}</div>
                                    <p className="text-xs text-red-500 mt-1">Clique para ver detalhes</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/dashboard/classes">
                            <Card className="hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer h-full border-l-4 border-l-blue-500">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-blue-700">Turmas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">{stats.classes.length}</div>
                                    <p className="text-xs text-blue-500 mt-1">Clique para gerenciar</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Academia</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate">{stats.gymName}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4">
                        <h2 className="text-lg font-semibold">Ações Rápidas</h2>
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                            <Link href="/dashboard/students" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition cursor-pointer bg-white shadow-sm">
                                <span className="font-medium">Adicionar Aluno</span>
                            </Link>
                            <Link href="/dashboard/classes" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition cursor-pointer bg-white shadow-sm">
                                <span className="font-medium">Nova Turma</span>
                            </Link>
                            <Link href="/dashboard/professors" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition cursor-pointer bg-white shadow-sm">
                                <span className="font-medium">Professores</span>
                            </Link>
                            <Link href="/dashboard/settings" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition cursor-pointer bg-white shadow-sm">
                                <span className="font-medium">Configurações</span>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
                    Nenhuma academia encontrada para sua conta. Por favor, contate o suporte.
                </div>
            )}
        </div>
    )
}
