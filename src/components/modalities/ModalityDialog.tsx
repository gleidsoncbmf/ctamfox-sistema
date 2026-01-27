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

interface Modality {
    id: string
    name: string
    description: string | null
    price: number
}

interface ModalityDialogProps {
    modality?: Modality
    children?: ReactNode
}

export function ModalityDialog({ modality, children }: ModalityDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(modality?.name || "")
    const [description, setDescription] = useState(modality?.description || "")
    const [price, setPrice] = useState(modality?.price?.toString() || "")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (modality) {
            setName(modality.name)
            setDescription(modality.description || "")
            setPrice(modality.price.toString())
        }
    }, [modality, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const method = modality ? "PUT" : "POST"
            const body = {
                id: modality?.id,
                name,
                description,
                price: parseFloat(price)
            }

            const res = await fetch("/api/modalities", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                setOpen(false)
                if (!modality) {
                    setName("")
                    setDescription("")
                    setPrice("")
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
                {children || <Button>Adicionar Modalidade</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{modality ? "Editar Modalidade" : "Adicionar Modalidade"}</DialogTitle>
                        <DialogDescription>
                            {modality ? "Atualize os dados da modalidade abaxio." : "Crie uma nova modalidade de arte marcial para sua academia."}
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
                                placeholder="ex: Jiu Jitsu"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Mensalidade
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="col-span-3"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Descrição
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
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
