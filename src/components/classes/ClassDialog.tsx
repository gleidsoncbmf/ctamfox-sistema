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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface ClassSession {
    id: string
    name: string
    schedule: string
    modalityId: string
    professorId: string
}

interface ClassDialogProps {
    modalities: { id: string, name: string }[]
    professors: { id: string, name: string }[]
    classSession?: ClassSession
    children?: ReactNode
}

export function ClassDialog({ modalities, professors, classSession, children }: ClassDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(classSession?.name || "")
    const [schedule, setSchedule] = useState(classSession?.schedule || "")
    const [modalityId, setModalityId] = useState(classSession?.modalityId || "")
    const [professorId, setProfessorId] = useState(classSession?.professorId || "")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (classSession) {
            setName(classSession.name)
            setSchedule(classSession.schedule)
            setModalityId(classSession.modalityId)
            setProfessorId(classSession.professorId)
        }
    }, [classSession, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const method = classSession ? "PUT" : "POST"
            const body = {
                id: classSession?.id,
                name,
                schedule,
                modalityId,
                professorId
            }

            const res = await fetch("/api/classes", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                setOpen(false)
                if (!classSession) {
                    setName("")
                    setSchedule("")
                    setModalityId("")
                    setProfessorId("")
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
                {children || <Button>Adicionar Turma</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{classSession ? "Editar Turma" : "Adicionar Turma"}</DialogTitle>
                        <DialogDescription>
                            {classSession ? "Atualize os dados da turma abaixo." : "Crie um novo horário de aula para uma modalidade."}
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
                                placeholder="ex: Jiu Jitsu Manhã"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="schedule" className="text-right">
                                Horário
                            </Label>
                            <Input
                                id="schedule"
                                value={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                                className="col-span-3"
                                placeholder="ex: Seg/Qua 08:00"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modality" className="text-right">
                                Modalidade
                            </Label>
                            <Select onValueChange={setModalityId} value={modalityId} required>
                                <SelectTrigger className="w-[180px] col-span-3 bg-white">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {modalities.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="professor" className="text-right">
                                Professor
                            </Label>
                            <Select onValueChange={setProfessorId} value={professorId} required>
                                <SelectTrigger className="w-[180px] col-span-3 bg-white">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {professors.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
