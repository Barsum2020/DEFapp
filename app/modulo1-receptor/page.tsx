'use client'

import { useState } from 'react'
import FileUploader from './components/FileUploader'
import DataPreview from './components/DataPreview'
import { DataType } from './components/DataTypeSelector'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from 'lucide-react'

interface UploadedData {
  type: DataType
  data: Record<string, any>[]
  month: string
  year: string
}

export default function ReceptorDeDatos() {
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null)

  const handleDataUploaded = (data: UploadedData) => {
    setUploadedData(data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Módulo 1: Receptor de Datos</h1>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Nota sobre los datos importados</AlertTitle>
        <AlertDescription>
          Los datos importados son acumulativos desde enero hasta el mes seleccionado.
          Por ejemplo, si selecciona mayo, los datos importados corresponderán al período de enero a mayo.
        </AlertDescription>
      </Alert>
      <FileUploader onDataUploaded={handleDataUploaded} />
      {uploadedData && (
        <DataPreview 
          data={uploadedData.data} 
          type={uploadedData.type} 
          month={uploadedData.month}
          year={uploadedData.year}
        />
      )}
    </div>
  )
}