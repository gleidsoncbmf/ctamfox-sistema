"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gymName: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push("/login")
            } else {
                const msg = await res.text()
                setError(msg || "Falha no registro")
            }
        } catch (err) {
            setError("Algo deu errado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>Registrar Academia</CardTitle>
                <CardDescription>
                    Crie uma conta para gerenciar sua academia de artes marciais.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Seu Nome</Label>
                            <Input
                                id="name"
                                placeholder="João Silva"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="gymName">Nome da Academia</Label>
                            <Input
                                id="gymName"
                                placeholder="Dojo Cobra Kai"
                                value={formData.gymName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="academia@exemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? "Criando Conta..." : "Registrar"}
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Entre aqui
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
