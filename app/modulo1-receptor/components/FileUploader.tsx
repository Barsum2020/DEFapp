'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import * as ExcelJS from 'exceljs'
import DataTypeSelector, { DataType } from './DataTypeSelector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from 'lucide-react'

interface UploadedData {
  type: DataType
  data: Record<string, any>[]
  month: string
  year: string
  company: string
}

interface FileUploaderProps {
  onDataUploaded: (uploadedData: UploadedData) => void
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export default function FileUploader({ onDataUploaded }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dataType, setDataType] = useState<DataType | null>(null)
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !dataType || !month || !year) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    try {
      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)

      const worksheet = workbook.worksheets[0]
      const jsonData: Record<string, any>[] = []

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return // Skip header row
        
        const rowData: Record<string, any> = {}
        row.eachCell((cell, colNumber) => {
          const header = worksheet.getRow(1).getCell(colNumber).value?.toString() || `Column${colNumber}`
          rowData[header] = cell.value
        })
        
        jsonData.push(rowData)
      })

      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const uploadedData = { type: dataType, data: jsonData, month, year, company: user.company }

      // Guardar datos en el backend
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadedData),
      })

      if (!response.ok) {
        throw new Error('Error al guardar los datos')
      }

      onDataUploaded(uploadedData)
      
      toast({
        title: "Éxito",
        description: `Archivo ${file.name} cargado, procesado y guardado correctamente como ${dataType} para ${month} ${year}.`,
      })
    } catch (error) {
      console.error('Error processing file:', error)
      toast({
        title: "Error",
        description: "Error al procesar o guardar el archivo Excel.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Información importante</AlertTitle>
        <AlertDescription>
          Al seleccionar un mes, se importarán los datos acumulados desde enero hasta el mes seleccionado.
          Por ejemplo, si selecciona septiembre, se importarán los datos de enero a septiembre.
        </AlertDescription>
      </Alert>
      <div>
        <Label htmlFor="file-upload">Selecciona un archivo Excel</Label>
        <Input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mt-1"
        />
      </div>
      <DataTypeSelector onSelect={setDataType} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="month-select">Mes (hasta el cual se acumulan los datos)</Label>
          <Select onValueChange={setMonth}>
            <SelectTrigger id="month-select">
              <SelectValue placeholder="Selecciona el mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year-input">Año</Label>
          <Input
            id="year-input"
            type="number"
            min="2000"
            max="2100"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="YYYY"
          />
        </div>
      </div>
      <Button type="submit" disabled={!file || !dataType || !month || !year}>Cargar y Procesar Archivo</Button>
    </form>
  )
}