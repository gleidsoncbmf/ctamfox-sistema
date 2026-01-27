"use client"

import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { data: session } = useSession()

    const navItems = [
        { href: "/dashboard", label: "Visão Geral" },
        { href: "/dashboard/professors", label: "Professores" },
        { href: "/dashboard/modalities", label: "Modalidades" },
        { href: "/dashboard/classes", label: "Turmas" },
        { href: "/dashboard/students", label: "Alunos" },
        { href: "/dashboard/settings", label: "Configurações" },
    ]

    return (
        <div className="flex min-h-screen w-full bg-gray-100/40">
            <div className="hidden border-r bg-white w-[250px] lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
                            <span className="">Gym Manager</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${pathname === item.href ? "bg-gray-100 text-gray-900" : ""
                                        }`}
                                    href={item.href}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-4 border-t">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-sm font-medium">{session?.user?.name}</div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full" onClick={() => signOut()}>
                            Sair
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 lg:hidden">
                    <span className="font-semibold">Gym Manager</span>
                    {/* Mobile menu trigger could go here */}
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
