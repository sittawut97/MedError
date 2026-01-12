'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Upload as UploadIcon, FileSpreadsheet, Download } from 'lucide-react'

const departments = [
  { id: '500_PreDispensing_pitchaya.t', name: '500_PreDispensing_pitchaya.t', manager: 'pitchaya.t', department: 'เภสัชกรรมผู้ป่วยนอก', deptid: '500' },
  { id: '500_intervention_pitchaya.t', name: '500_intervention_pitchaya.t', manager: 'pitchaya.t', department: 'เภสัชกรรมผู้ป่วยใน', deptid: '500' },
  { id: '501_panjaree.s', name: '501_panjaree.s', manager: 'panjaree.s', department: 'เภสัชกรรมผู้ป่วยนอก', deptid: '501' },
  { id: '502_petcharat.to', name: '502_petcharat.to', manager: 'petcharat.to', department: 'เภสัชกรรมคลินิก', deptid: '502' }
]

// Master data for dropdowns
const masterIPSG = ['0', '1', '2', '3', '4', '5']

const masterDrugSeverity = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const masterSubCategories = [
  { value: '124:การสั่ง (Prescribing Error)', label: '124:การสั่ง (Prescribing Error)' },
  { value: '125:การรับคำสั่ง/คัดลอกคำสั่ง (Transcribing Error)', label: '125:การรับคำสั่ง/คัดลอกคำสั่ง (Transcribing Error)' },
  { value: '126:การจัดและตรวจสอบยาก่อนจ่าย (Pre-dispensing Error)', label: '126:การจัดและตรวจสอบยาก่อนจ่าย (Pre-dispensing Error)' },
  { value: '127:การจ่าย (Dispensing Error)', label: '127:การจ่าย (Dispensing Error)' },
  { value: '284:การส่ง (Transportation Error)', label: '284:การส่ง (Transportation Error)' },
  { value: '129:การให้ (Administration Error)', label: '129:การให้ (Administration Error)' },
  { value: '128:การจัดยาก่อนให้ (Pre-administration Error)', label: '128:การจัดยาก่อนให้ (Pre-administration Error)' },
  { value: '132:การคืนยา (Drug_return)', label: '132:การคืนยา (Drug_return)' },
  { value: '285:สินค้าคงคลัง (Inventory)', label: '285:สินค้าคงคลัง (Inventory)' },
  { value: '130:อาการไม่พึงประสงค์ (Report_ADR)', label: '130:อาการไม่พึงประสงค์ (Report_ADR)' },
  { value: '131:การจองเลือดและส่วนประกอบ', label: '131:การจองเลือดและส่วนประกอบ' },
  { value: '133:อื่นๆระบุ...', label: '133:อื่นๆระบุ...' }
]

const masterFailureCause = [
  { value: '239:contraindication', label: '239:contraindication' },
  { value: '240:damaged package', label: '240:damaged package' },
  { value: '241:drug allergy and sensitivity', label: '241:drug allergy and sensitivity' },
  { value: '242:drug interaction', label: '242:drug interaction' },
  { value: '243:expired/damage', label: '243:expired/damage' },
  { value: '244:extra-dose error', label: '244:extra-dose error' },
  { value: '245:Incomplete order', label: '245:Incomplete order' },
  { value: '246:omission error', label: '246:omission error' },
  { value: '247:therapeutic duplication', label: '247:therapeutic duplication' },
  { value: '248:wrong calculation', label: '248:wrong calculation' },
  { value: '249:wrong criteria', label: '249:wrong criteria' },
  { value: '250:wrong dosage form', label: '250:wrong dosage form' },
  { value: '251:wrong dose/strength', label: '251:wrong dose/strength' },
  { value: '252:wrong drug', label: '252:wrong drug' },
  { value: '253:wrong frequency', label: '253:wrong frequency' },
  { value: '264:wrong HAD identification', label: '264:wrong HAD identification' },
  { value: '254:wrong label', label: '254:wrong label' },
  { value: '255:wrong patient', label: '255:wrong patient' },
  { value: '256:wrong quantity', label: '256:wrong quantity' },
  { value: '257:wrong rate of administration', label: '257:wrong rate of administration' },
  { value: '258:wrong route', label: '258:wrong route' },
  { value: '259:wrong technique', label: '259:wrong technique' },
  { value: '260:wrong-time error', label: '260:wrong-time error' },
  { value: '262:ลงบันทึกหลังการให้ยาเกิดความคลาดเคลื่อน', label: '262:ลงบันทึกหลังการให้ยาเกิดความคลาดเคลื่อน' },
  { value: '263:ให้ยาคลาดเคลื่อนที่เกิดจากการเตรียมยาที่ไม่เหมาะสมหรือไม่ถูกต้อง', label: '263:ให้ยาคลาดเคลื่อนที่เกิดจากการเตรียมยาที่ไม่เหมาะสมหรือไม่ถูกต้อง' },
  { value: '265:อื่นๆ', label: '265:อื่นๆ' }
]

const masterDrugErrorLocation = ['OPD', 'IPD', 'OTH']

// Required headers according to Epic2 Story2
const requiredHeaders = [
  'OccDate',
  'OccTime', 
  'LocationTxt',
  'OccDesc',
  'IPSG',
  'DrugSeverity',
  'HN',
  'PatientName',
  'VisitDate',
  'Physician',
  'PhysicianNo',
  'SubCategories_1',
  'FailureCause_1',
  'DrugErrorLocation',
  'DrugCode1',
  'DrugDesc1',
  'IsHighAlert1',
  'DrugCode2',
  'DrugDesc2',
  'IsHighAlert2',
  'PharmaRevisedBy',
  'PharmaRevisedRemark'
]

const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'True' : 'False'
  if (typeof value === 'object') return JSON.stringify(value)
  return ''
}

// Validation functions for Story 3
const validateOccDate = (value: string): boolean => {
  if (!value) return false
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  return dateRegex.test(value) && !isNaN(Date.parse(value))
}

const validateOccTime = (value: string): boolean => {
  if (!value) return false
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(value)
}

const validateVisitDate = (value: string): boolean => {
  if (!value) return false
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  return dateRegex.test(value) && !isNaN(Date.parse(value))
}

const validateDrugErrorLocation = (value: string): boolean => {
  if (!value) return false
  const trimmedValue = value.trim().toUpperCase()
  return trimmedValue === 'IPD' || trimmedValue === 'OPD' || trimmedValue === 'OTH'
}

const validateNumberPrefix = (value: string): boolean => {
  if (!value) return false
  // Format must be number: (e.g., 124:)
  const numberPrefixRegex = /^\d+:/
  return numberPrefixRegex.test(value.trim())
}

const isValidCell = (header: string, value: unknown): boolean => {
  const stringValue = formatCellValue(value)
  
  switch (header) {
    case 'OccDate':
      return validateOccDate(stringValue)
    case 'OccTime':
      return validateOccTime(stringValue)
    case 'VisitDate':
      return validateVisitDate(stringValue)
    case 'DrugErrorLocation':
      return validateDrugErrorLocation(stringValue)
    case 'SubCategories_1':
    case 'FailureCause_1':
      return validateNumberPrefix(stringValue)
    default:
      return true // No validation for other fields
  }
}

const getValidationMessage = (header: string, value: unknown): string => {
  const stringValue = formatCellValue(value)
  
  switch (header) {
    case 'OccDate':
      return `รูปแบบวันที่ไม่ถูกต้อง: "${stringValue}" ต้องเป็น YYYY-MM-DD`
    case 'OccTime':
      return `รูปแบบเวลาไม่ถูกต้อง: "${stringValue}" ต้องเป็น HH:MM`
    case 'VisitDate':
      return `รูปแบบวันที่ไม่ถูกต้อง: "${stringValue}" ต้องเป็น YYYY-MM-DD`
    case 'DrugErrorLocation':
      return `ค่าไม่ถูกต้อง: "${stringValue}" ต้องเป็น IPD หรือ OPD เท่านั้น`
    case 'SubCategories_1':
      return `รูปแบบไม่ถูกต้อง: "${stringValue}" ต้องขึ้นต้นด้วยตัวเลขตามด้วย : (เช่น 124:)`
    case 'FailureCause_1':
      return `รูปแบบไม่ถูกต้อง: "${stringValue}" ต้องขึ้นต้นด้วยตัวเลขตามด้วย : (เช่น 124:)`
    default:
      return ''
  }
}

export default function UploadPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined)
  const [selectedDepartmentInfo, setSelectedDepartmentInfo] = useState<{manager: string, department: string, deptid: string} | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedData, setUploadedData] = useState<Record<string, unknown>[]>([])
  const [validationError, setValidationError] = useState<string>('')
  const [columnHasErrors, setColumnHasErrors] = useState<Set<string>>(new Set())
  const [editingCell, setEditingCell] = useState<{rowIndex: number, header: string, oldValue: string} | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedDepartment || !selectedFile) {
      return
    }

    // Save department info
    const deptInfo = departments.find(d => d.id === selectedDepartment)
    if (deptInfo) {
      setSelectedDepartmentInfo({
        manager: deptInfo.manager,
        department: deptInfo.department,
        deptid: deptInfo.deptid
      })
    }

    try {
      // Import read-excel-file dynamically
      const readXlsxFile = (await import('read-excel-file')).default
      
      // Read Excel file - first sheet only, row 1 as headers
      const rows = await readXlsxFile(selectedFile)
      
      if (rows.length > 0) {
        // First row is headers
        const headers = rows[0] as string[]
        
        // Normalize header function: ignore case and remove spaces
        const normalizeHeader = (header: string): string => {
          return String(header).toLowerCase().replace(/\s+/g, '')
        }
        
        // Normalize headers from Excel
        const normalizedHeaders = headers.map(h => normalizeHeader(h))
        // normalizedRequiredHeaders removed - using inline normalization instead
        
        // Validate headers against required headers (case-insensitive, space-insensitive)
        const missingHeaders = requiredHeaders.filter(required => {
          const normalizedRequired = normalizeHeader(required)
          return !normalizedHeaders.includes(normalizedRequired)
        })
        
        if (missingHeaders.length > 0) {
          setValidationError(`ขาดหัวตาราง (Headers) ต่อไปนี้: ${missingHeaders.join(', ')}`)
          return
        }
        
        // Clear validation error if headers are valid
        setValidationError('')
        
        // Convert remaining rows to objects, only include required headers
        const data = rows.slice(1).map((row) => {
          const obj: Record<string, unknown> = {}
          requiredHeaders.forEach(header => {
            // Find header index using normalized comparison
            const normalizedRequired = normalizeHeader(header)
            const headerIndex = normalizedHeaders.findIndex(h => h === normalizedRequired)
            obj[header] = headerIndex !== -1 ? (row[headerIndex] || '') : ''
          })
          return obj
        })
        
        // Check which columns have validation errors
        const errorsInColumns = new Set<string>()
        data.forEach(row => {
          requiredHeaders.forEach(header => {
            if (!isValidCell(header, row[header])) {
              errorsInColumns.add(header)
            }
          })
        })
        
        setColumnHasErrors(errorsInColumns)
        setUploadedData(data)
      }
      
      setIsDialogOpen(false)
      setSelectedDepartment(undefined)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error reading Excel file:', error)
      setValidationError('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel')
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedDepartment(undefined)
    setSelectedFile(null)
    setValidationError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCellClick = (rowIndex: number, header: string, value: unknown, isValid: boolean) => {
    if (!isValid) {
      setEditingCell({ rowIndex, header, oldValue: formatCellValue(value) })
      setEditValue(formatCellValue(value))
    }
  }

  const handleSaveEdit = () => {
    if (!editingCell) return

    // Update data
    const newData = [...uploadedData]
    newData[editingCell.rowIndex][editingCell.header] = editValue

    // Recalculate column errors
    const errorsInColumns = new Set<string>()
    newData.forEach(row => {
      requiredHeaders.forEach(header => {
        if (!isValidCell(header, row[header])) {
          errorsInColumns.add(header)
        }
      })
    })

    setColumnHasErrors(errorsInColumns)
    setUploadedData(newData)
    setEditingCell(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const handleDownloadExcel = async () => {
    if (!selectedDepartmentInfo || uploadedData.length === 0) return

    try {
      // Import xlsx dynamically
      const XLSX = await import('xlsx')

      // Define download headers mapping according to Story 4
      const downloadHeaders = [
        'Department',
        'OccDate',
        'OccTime',
        'LocationTxt',
        'OccDesc',
        'IPSG',
        'DrugSeverity',
        'HN',
        'PatientName',
        'VisitDate',
        'Physician',
        'PhysicianNo',
        'SubCategories_1',
        'SubCategoriesText_1',
        'FailureCause_1',
        'FailureCauseText_1',
        'SubCategories_2',
        'SubCategoriesText_2',
        'FailureCause_2',
        'FailureCauseText_2',
        'SubCategories_3',
        'SubCategoriesText_3',
        'FailureCause_3',
        'FailureCauseText_3',
        'SubCategories_4',
        'SubCategoriesText_4',
        'FailureCause_4',
        'FailureCauseText_4',
        'SubCategories_5',
        'SubCategoriesText_5',
        'FailureCause_5',
        'FailureCauseText_5',
        'DrugErrorLocation',
        'DrugCode1',
        'DrugDesc1',
        'IsHighAlert1',
        'DrugCode2',
        'DrugDesc2',
        'IsHighAlert2',
        'PharmaRevisedBy',
        'PharmaRevisedBy1',
        'PharmaRevisedRemark'
      ]

      // Map data according to Story 4
      const mappedData = uploadedData.map(row => {
        const mappedRow: Record<string, unknown> = {}
        
        // Department: {deptid:department}
        mappedRow['Department'] = `${selectedDepartmentInfo.deptid}:${selectedDepartmentInfo.department}`
        
        // Direct mappings
        mappedRow['OccDate'] = row['OccDate'] || ''
        mappedRow['OccTime'] = row['OccTime'] || ''
        mappedRow['LocationTxt'] = row['LocationTxt'] || ''
        mappedRow['OccDesc'] = row['OccDesc'] || ''
        mappedRow['IPSG'] = row['IPSG'] || ''
        mappedRow['DrugSeverity'] = row['DrugSeverity'] || ''
        mappedRow['HN'] = row['HN'] || ''
        mappedRow['PatientName'] = row['PatientName'] || ''
        mappedRow['VisitDate'] = row['VisitDate'] || ''
        mappedRow['Physician'] = row['Physician'] || ''
        mappedRow['PhysicianNo'] = row['PhysicianNo'] || ''
        mappedRow['SubCategories_1'] = row['SubCategories_1'] || ''
        
        // SubCategoriesText_1 is empty (according to Story 4.1)
        mappedRow['SubCategoriesText_1'] = ''
        
        // FailureCause_1 maps to FailureCause_1 (according to Story 4.1)
        mappedRow['FailureCause_1'] = row['FailureCause_1'] || ''
        mappedRow['FailureCauseText_1'] = ''
        mappedRow['SubCategories_2'] = ''
        mappedRow['SubCategoriesText_2'] = ''
        mappedRow['FailureCause_2'] = ''
        mappedRow['FailureCauseText_2'] = ''
        mappedRow['SubCategories_3'] = ''
        mappedRow['SubCategoriesText_3'] = ''
        mappedRow['FailureCause_3'] = ''
        mappedRow['FailureCauseText_3'] = ''
        mappedRow['SubCategories_4'] = ''
        mappedRow['SubCategoriesText_4'] = ''
        mappedRow['FailureCause_4'] = ''
        mappedRow['FailureCauseText_4'] = ''
        mappedRow['SubCategories_5'] = ''
        mappedRow['SubCategoriesText_5'] = ''
        mappedRow['FailureCause_5'] = ''
        mappedRow['FailureCauseText_5'] = ''
        
        mappedRow['DrugErrorLocation'] = row['DrugErrorLocation'] || ''
        mappedRow['DrugCode1'] = row['DrugCode1'] || ''
        mappedRow['DrugDesc1'] = row['DrugDesc1'] || ''
        mappedRow['IsHighAlert1'] = row['IsHighAlert1'] || ''
        mappedRow['DrugCode2'] = row['DrugCode2'] || ''
        mappedRow['DrugDesc2'] = row['DrugDesc2'] || ''
        mappedRow['IsHighAlert2'] = row['IsHighAlert2'] || ''
        
        // PharmaRevisedBy: manager from selected department
        mappedRow['PharmaRevisedBy'] = selectedDepartmentInfo.manager
        
        // PharmaRevisedBy1: original PharmaRevisedBy
        mappedRow['PharmaRevisedBy1'] = row['PharmaRevisedBy'] || ''
        
        mappedRow['PharmaRevisedRemark'] = row['PharmaRevisedRemark'] || ''
        
        return mappedRow
      })

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(mappedData, { header: downloadHeaders })
      
      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Data')
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const filename = `MedError_${selectedDepartmentInfo.deptid}_${timestamp}.xlsx`
      
      // Download file
      XLSX.writeFile(wb, filename)
    } catch (error) {
      console.error('Error creating Excel file:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="w-full py-4 px-4">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">Upload Med Error</h1>
              
              {/* Upload Button - Next to title */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <UploadIcon className="h-4 w-4" />
                      <span>Upload Med Error</span>
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Upload Medical Error Data</DialogTitle>
                    <DialogDescription>
                      Select department and choose Excel file to upload
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {validationError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {validationError}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Excel File</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          ref={fileInputRef}
                          id="file"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileSelect}
                          className="cursor-pointer"
                        />
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpload}
                      disabled={!selectedDepartment || !selectedFile}
                    >
                      OK
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Download Excel Button - Show only when no errors */}
            {uploadedData.length > 0 && columnHasErrors.size === 0 && (
              <Button 
                onClick={handleDownloadExcel}
                className="flex items-center space-x-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                <span>Download Excel</span>
              </Button>
            )}
          </div>

          {/* Edit Cell Dialog */}
          <Dialog open={editingCell !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>แก้ไขข้อมูล</DialogTitle>
                <DialogDescription>
                  แก้ไขค่าที่ไม่ถูกต้องให้เป็นไปตามรูปแบบที่กำหนด
                </DialogDescription>
              </DialogHeader>
              {editingCell && (
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>ชื่อคอลัมน์</Label>
                    <Input value={editingCell.header} disabled className="bg-gray-100" />
                  </div>
                  <div className="space-y-2">
                    <Label>ค่าเก่า (ผิด)</Label>
                    <Input value={editingCell.oldValue} disabled className="bg-red-50 text-red-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newValue">ค่าใหม่ (ถูกต้อง)</Label>
                    {(editingCell.header === 'IPSG' || 
                      editingCell.header === 'DrugSeverity' || 
                      editingCell.header === 'DrugErrorLocation') && (
                      <Select value={editValue} onValueChange={setEditValue}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกค่าที่ถูกต้อง" />
                        </SelectTrigger>
                        <SelectContent>
                          {editingCell.header === 'IPSG' && masterIPSG.map(item => (
                            <SelectItem key={item} value={item}>{item}</SelectItem>
                          ))}
                          {editingCell.header === 'DrugSeverity' && masterDrugSeverity.map(item => (
                            <SelectItem key={item} value={item}>{item}</SelectItem>
                          ))}
                          {editingCell.header === 'DrugErrorLocation' && masterDrugErrorLocation.map(item => (
                            <SelectItem key={item} value={item}>{item}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {(editingCell.header === 'SubCategories_1') && (
                      <Select value={editValue} onValueChange={setEditValue}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกหมวดหมู่" />
                        </SelectTrigger>
                        <SelectContent>
                          {masterSubCategories.map(item => (
                            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {(editingCell.header === 'FailureCause_1') && (
                      <Select value={editValue} onValueChange={setEditValue}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสาเหตุ" />
                        </SelectTrigger>
                        <SelectContent>
                          {masterFailureCause.map(item => (
                            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {(editingCell.header !== 'IPSG' && 
                      editingCell.header !== 'DrugSeverity' && 
                      editingCell.header !== 'DrugErrorLocation' &&
                      editingCell.header !== 'SubCategories_1' &&
                      editingCell.header !== 'FailureCause_1') && (
                      <Input
                        id="newValue"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="กรอกค่าใหม่ที่ถูกต้อง"
                      />
                    )}
                    <p className="text-xs text-gray-500">
                      {getValidationMessage(editingCell.header, editingCell.oldValue)}
                    </p>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={handleCancelEdit}>
                  ยกเลิก
                </Button>
                <Button onClick={handleSaveEdit}>
                  บันทึก
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Uploaded Data Table */}
          {uploadedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Data</CardTitle>
                <CardDescription>
                  Recently uploaded medical error data
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border border-gray-300">
                  <div className="overflow-auto h-[calc(100vh-280px)]">
                    <table className="w-full border-collapse bg-white">
                      <thead className="sticky top-0 bg-gray-50 z-10">
                        <tr>
                          {requiredHeaders.map((header) => {
                            const hasError = columnHasErrors.has(header)
                            return (
                              <th 
                                key={header} 
                                className={`border px-3 py-2 text-left text-xs font-semibold whitespace-nowrap min-w-[100px] ${
                                  hasError 
                                    ? 'bg-red-100 text-red-800 border-red-300' 
                                    : 'bg-gray-100 text-gray-700 border-gray-300'
                                }`}
                                style={{ position: 'sticky', top: 0 }}
                                title={hasError ? `คอลัมน์นี้มีข้อมูลที่ไม่ถูกต้อง` : undefined}
                              >
                                {header}
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedData.map((row, index) => {
                          const uniqueKey = `${selectedDepartment || 'dept'}-${Date.now()}-${index}`
                          return (
                            <tr key={uniqueKey} className="hover:bg-gray-50">
                              {requiredHeaders.map((header, cellIndex) => {
                                const value = row[header]
                                const isValid = isValidCell(header, value)
                                const baseColor = cellIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                
                                let cellClasses = 'border px-3 py-2 text-sm '
                                cellClasses += header === 'OccDesc' ? 'max-w-xs truncate ' : 'whitespace-nowrap '
                                
                                if (isValid) {
                                  cellClasses += 'border-gray-300 ' + baseColor
                                } else {
                                  cellClasses += 'border-yellow-300 bg-yellow-100'
                                }
                                
                                let titleText = ''
                                if (isValid && header === 'OccDesc') {
                                  titleText = formatCellValue(value)
                                } else if (!isValid) {
                                  titleText = getValidationMessage(header, value)
                                }
                                
                                const cursorClass = isValid ? '' : 'cursor-pointer hover:bg-yellow-200'
                                
                                return (
                                  <td 
                                    key={`${uniqueKey}-${header}`} 
                                    className={`${cellClasses} ${cursorClass}`}
                                    title={titleText || undefined}
                                    onClick={() => handleCellClick(index, header, value, isValid)}
                                  >
                                    {formatCellValue(value)}
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 text-sm text-gray-600 border-t">
                    Total rows: {uploadedData.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}