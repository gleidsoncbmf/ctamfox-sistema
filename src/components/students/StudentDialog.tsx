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
import { MultiSelect } from "@/components/ui/MultiSelect"
import { useState, useMemo, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"

interface ClassOption {
    id: string
    name: string
    modality: { price: number }
}

interface Student {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    paymentStatus: string
    classes: { id: string, name: string, modality: { price: number } }[]
}

interface StudentDialogProps {
    classes: ClassOption[]
    student?: Student
}

export function StudentDialog({ classes, student }: StudentDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(student?.name || "")
    const [email, setEmail] = useState(student?.email || "")
    const [phone, setPhone] = useState(student?.phone || "")
    const [paymentStatus, setPaymentStatus] = useState(student?.paymentStatus || "ACTIVE")
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>(
        student?.classes?.map(c => c.id) || []
    )

    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (student) {
            setName(student.name)
            setEmail(student.email || "")
            setPhone(student.phone || "")
            setPaymentStatus(student.paymentStatus)
            setSelectedClassIds(student.classes?.map(c => c.id) || [])
        } else {
            // Reset for new entry if dialog is reused without unmounting?
            // Usually better to control this via 'open' or key
        }
    }, [student, open])

    const totalPrice = useMemo(() => {
        if (!classes || !Array.isArray(classes)) return 0
        return selectedClassIds.reduce((acc, id) => {
            const cls = classes.find(c => c.id === id)
            return acc + (cls?.modality?.price ?? 0)
        }, 0)
    }, [selectedClassIds, classes])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const method = student ? "PUT" : "POST"
            const body = {
                id: student?.id,
                name,
                email,
                phone,
                paymentStatus,
                classIds: selectedClassIds
            }

            const res = await fetch("/api/students", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                setOpen(false)
                if (!student) {
                    setName("")
                    setEmail("")
                    setPhone("")
                    setPaymentStatus("ACTIVE")
                    setSelectedClassIds([])
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
                {student ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>Adicionar Aluno</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{student ? "Editar Aluno" : "Adicionar Aluno"}</DialogTitle>
                        <DialogDescription>
                            {student ? "Atualize os dados do aluno abaixo." : "Registre um novo aluno e defina seu status inicial."}
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
                                placeholder="Nome do Aluno"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="col-span-3"
                                placeholder="email@exemplo.com"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Telefone
                            </Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="col-span-3"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Turmas
                            </Label>
                            <div className="col-span-3">
                                <MultiSelect
                                    options={(classes || []).map(c => ({ label: c.name, value: c.id }))}
                                    selected={selectedClassIds}
                                    onChange={setSelectedClassIds}
                                    placeholder="Selecione as turmas..."
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Mensalidade Total: <span className="font-bold text-green-600">R$ {totalPrice.toFixed(2)}</span>
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select onValueChange={setPaymentStatus} value={paymentStatus}>
                                <SelectTrigger className="w-[180px] col-span-3">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                                    <SelectItem value="LATE">Pagamento Atrasado</SelectItem>
                                    <SelectItem value="INACTIVE">Inativo</SelectItem>
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
