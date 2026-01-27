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
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function SettingsContent() {
    const router = useRouter()
    const [gymName, setGymName] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        // Fetch current settings
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.name) setGymName(data.name)
            })
            .catch(err => console.error(err))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: gymName }),
            })

            if (res.ok) {
                setMessage("Configurações salvas com sucesso!")
                router.refresh()
            } else {
                setMessage("Falha ao salvar configurações.")
            }
        } catch (err) {
            setMessage("Algo deu errado.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Configurações da Academia</h1>
            </div>

            <Card className="max-w-[600px]">
                <CardHeader>
                    <CardTitle>Informações Gerais</CardTitle>
                    <CardDescription>
                        Atualize os detalhes públicos da sua academia.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="gymName">Nome da Academia</Label>
                                <Input
                                    id="gymName"
                                    value={gymName}
                                    onChange={(e) => setGymName(e.target.value)}
                                    placeholder="Digite o nome da academia"
                                    required
                                />
                            </div>
                            {message && (
                                <p className={`text-sm ${message.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                                    {message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
