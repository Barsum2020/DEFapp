import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataType } from './DataTypeSelector'

interface DataPreviewProps {
  data: Record<string, any>[]
  type: DataType
  month: string
  year: string
}

export default function DataPreview({ data, type, month, year }: DataPreviewProps) {
  if (data.length === 0) {
    return <div className="text-center mt-4">No hay datos para mostrar.</div>
  }

  const headers = Object.keys(data[0])

  const getTypeTitle = (type: DataType) => {
    switch (type) {
      case 'pyg_actual':
        return 'PyG Ejercicio Actual'
      case 'pyg_anterior':
        return 'PyG Ejercicio Anterior'
      case 'pyg_presupuesto':
        return 'PyG Presupuesto Ejercicio Actual'
      default:
        return 'Datos'
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Vista Previa de {getTypeTitle(type)}</h2>
      <p className="text-lg mb-4">Datos acumulados de enero a {month} {year}</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 5).map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={`${index}-${header}`}>{row[header]?.toString()}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {data.length > 5 && (
        <p className="text-sm text-gray-500 mt-2">Mostrando 5 de {data.length} filas</p>
      )}
    </div>
  )
}