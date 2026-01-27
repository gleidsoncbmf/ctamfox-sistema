"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface Professor {
    id: string
    name: string
    specialty: string | null
}

interface ProfessorDialogProps {
    professor?: Professor
    children?: ReactNode
}

export function ProfessorDialog({ professor, children }: ProfessorDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(professor?.name || "")
    const [specialty, setSpecialty] = useState(professor?.specialty || "")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (professor) {
            setName(professor.name)
            setSpecialty(professor.specialty || "")
        }
    }, [professor, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const method = professor ? "PUT" : "POST"
            const body = {
                id: professor?.id,
                name,
                specialty
            }

            const res = await fetch("/api/professors", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                setOpen(false)
                if (!professor) {
                    setName("")
                    setSpecialty("")
                }
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button>Adicionar Professor</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{professor ? "Editar Professor" : "Adicionar Professor"}</DialogTitle>
                        <DialogDescription>
                            {professor ? "Atualize os dados do professor abaixo." : "Registre um novo professor para sua academia."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nome
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="ex: Mestre Shifu"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="specialty" className="text-right">
                                Especialidade
                            </Label>
                            <Input
                                id="specialty"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                className="col-span-3"
                                placeholder="ex: Kung Fu"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
