import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios, { AxiosProgressEvent } from 'axios'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface FileState {
    file: File
    progress: number
    converted: boolean
    error: string | null
}

export default function App() {
    const [files, setFiles] = useState<FileState[]>([])
    const [converting, setConverting] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles.map(file => ({
            file,
            progress: 0,
            converted: false,
            error: null
        })))
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {'image/jpeg': ['.jpg', '.jpeg']},
        multiple: true,
        onDragEnter: undefined,
        onDragOver: undefined,
        onDragLeave: undefined
    })

    const convertFiles = async () => {
        setConverting(true)
        const convertedFiles: Array<{name: string; data: ArrayBuffer}> = []

        try {
            await Promise.all(files.map(async (fileState, index) => {
                const formData = new FormData()
                formData.append('image', fileState.file)

                const response = await axios.post<ArrayBuffer>(
                    'http://localhost:3001/convert',
                    formData,
                    {
                        responseType: 'arraybuffer',
                        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) / (progressEvent.total || 1)
                            )
                            setFiles(prev => prev.map((f, i) =>
                                i === index ? {...f, progress} : f
                            ))
                        }
                    }
                )

                convertedFiles.push({
                    name: fileState.file.name.replace(/\.jpe?g$/, '.webp'),
                    data: response.data
                })
            }))

            if (convertedFiles.length === 1) {
                const file = convertedFiles[0]
                saveAs(new Blob([file.data]), file.name)
            } else {
                const zip = new JSZip()
                convertedFiles.forEach(file => {
                    zip.file(file.name, file.data)
                })
                const content = await zip.generateAsync({ type: 'blob' })
                saveAs(content, 'converted-images.zip')
            }
        } catch (error) {
            console.error('Conversion error:', error)
            if (error instanceof Error) {
                // Manejar error específico si es necesario
            }
        } finally {
            setConverting(false)
        }
    }

    // @ts-ignore
    return (
        <div>
            <div {...getRootProps()} style={dropzoneStyle}>
                {/* @ts-ignore */}
                <input {...getInputProps()} />
                <p>Arrastra imágenes JPG aquí o haz clic para seleccionar</p>
            </div>

            <div>
                {files.map((file, index) => (
                    <div key={index}>
                        <p>{file.file.name} - {file.progress}%</p>
                    </div>
                ))}
            </div>

            {files.length > 0 && (
                <button
                    onClick={convertFiles}
                    disabled={converting}
                >
                    {converting ? 'Convirtiendo...' : 'Convertir y Descargar'}
                </button>
            )}
        </div>
    )
}

const dropzoneStyle: React.CSSProperties = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    margin: '20px'
}