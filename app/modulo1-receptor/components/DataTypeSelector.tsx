import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export type DataType = 'pyg_actual' | 'pyg_anterior' | 'pyg_presupuesto'

interface DataTypeSelectorProps {
  onSelect: (type: DataType) => void
}

export default function DataTypeSelector({ onSelect }: DataTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="data-type">Tipo de Datos</Label>
      <Select onValueChange={onSelect}>
        <SelectTrigger id="data-type">
          <SelectValue placeholder="Selecciona el tipo de datos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pyg_actual">PyG Ejercicio Actual</SelectItem>
          <SelectItem value="pyg_anterior">PyG Ejercicio Anterior</SelectItem>
          <SelectItem value="pyg_presupuesto">PyG Presupuesto Ejercicio Actual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}