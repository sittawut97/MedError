'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search } from 'lucide-react'

const departments = [
  { id: '500_1_pitchaya.t', name: '500_1_pitchaya.t', uploadCount: 0, lastUpload: null },
  { id: '500_2_pitchaya.t', name: '500_2_pitchaya.t', uploadCount: 5, lastUpload: '2024-11-28 14:30' },
  { id: '501_panjaree.s', name: '501_panjaree.s', uploadCount: 3, lastUpload: '2024-11-27 09:15' },
  { id: '502_petcharat.to', name: '502_petcharat.to', uploadCount: 8, lastUpload: '2024-11-28 16:45' }
]

// Mock data for demonstration
const mockData = [
  {
    OccDate: '2024-11-01',
    OccTime: '14:30',
    LocationTxt: 'ICU Ward',
    OccDesc: 'Medication dosage error',
    IPSG: 'IPSG-001',
    DrugSeverity: 'High',
    HN: 'HN123456',
    PatientName: 'John Doe',
    VisitDate: '2024-11-01',
    Physician: 'Dr. Smith',
    PhysicianNo: 'P001',
    SubCategories_1: 'Dosage',
    SubCategoriesText_1: 'Wrong dosage administered',
    FailureCause_1: 'Human Error',
    FailureCauseText_1: 'Miscalculation',
    DrugErrorLocation: 'Nursing Station',
    DrugCode1: 'D001',
    DrugDesc1: 'Morphine',
    IsHighAlert1: 'Yes',
    DrugCode2: '',
    DrugDesc2: '',
    IsHighAlert2: '',
    PharmaRevisedBy1: 'Pharmacist A',
    PharmaRevisedRemark: 'Reviewed and corrected'
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState('11')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [searchText, setSearchText] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [batchId, setBatchId] = useState('')

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const currentDate = new Date()
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  const years = Array.from({ length: 5 }, (_, i) => (currentDate.getFullYear() - 2 + i).toString())

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="w-full py-4 px-4">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            
            {/* Month/Year Selection - Compact */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Period:</span>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Department Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {departments.map((dept) => (
              <Card 
                key={dept.id}
                className={`border-2 ${
                  dept.uploadCount === 0 
                    ? "bg-red-50 border-red-200" 
                    : "bg-green-50 border-green-200"
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span 
                      className={`text-2xl font-bold ${
                        dept.uploadCount === 0 ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {dept.uploadCount}
                    </span>
                    <div 
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        dept.uploadCount === 0 
                          ? "bg-red-200 text-red-800" 
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {dept.uploadCount === 0 ? "No Data" : dept.lastUpload}
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${
                    dept.uploadCount === 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    Uploaded rows
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Data Section */}
          <Card>
            <CardHeader>
              <CardTitle>Med Error Data</CardTitle>
              <CardDescription>Search and filter medical error reports</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search Filters */}
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search text..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Input
                    placeholder="Batch ID"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                  />
                </div>
                <Button>Search</Button>
              </div>

              {/* Data Table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OccDate</TableHead>
                      <TableHead>OccTime</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>IPSG</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>HN</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Visit Date</TableHead>
                      <TableHead>Physician</TableHead>
                      <TableHead>Drug Code</TableHead>
                      <TableHead>Drug Desc</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.OccDate}</TableCell>
                        <TableCell>{row.OccTime}</TableCell>
                        <TableCell>{row.LocationTxt}</TableCell>
                        <TableCell>{row.OccDesc}</TableCell>
                        <TableCell>{row.IPSG}</TableCell>
                        <TableCell>
                          <Badge variant={row.DrugSeverity === 'High' ? "destructive" : "default"}>
                            {row.DrugSeverity}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.HN}</TableCell>
                        <TableCell>{row.PatientName}</TableCell>
                        <TableCell>{row.VisitDate}</TableCell>
                        <TableCell>{row.Physician}</TableCell>
                        <TableCell>{row.DrugCode1}</TableCell>
                        <TableCell>{row.DrugDesc1}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}