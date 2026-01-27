"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface StudentFilterProps {
    classes: { id: string, name: string }[]
}

export function StudentFilter({ classes }: StudentFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentClassId = searchParams.get("classId") || "all"

    const handleFilterChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            params.delete("classId")
        } else {
            params.set("classId", value)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <Select value={currentClassId} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[200px] bg-white">
                    <SelectValue placeholder="Filtrar por Turma" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as Turmas</SelectItem>
                    {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
