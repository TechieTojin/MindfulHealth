import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaFileUpload, FaFileDownload, FaShareAlt, FaSearch, FaEllipsisV, FaFilePdf, FaFileImage, FaFileCsv, FaLock, FaEye, FaCalendarAlt, FaHospital, FaUser, FaStethoscope, FaDownload } from 'react-icons/fa';

// Mock data generator
const generateMedicalRecords = () => {
  const recordTypes = ['Lab Result', 'Prescription', 'Doctor Note', 'Imaging', 'Vaccination', 'Discharge Summary'];
  const providers = ['City Hospital', 'Wellness Clinic', 'Primary Care Associates', 'University Medical Center', 'Family Health Partners'];
  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis', 'Dr. Miller'];
  const fileTypes = ['pdf', 'csv', 'jpg', 'doc'];
  
  return Array(15).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Random date within last 6 months
    
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    
    return {
      id: `med-${i + 1}`,
      title: `${recordType} - ${date.toLocaleDateString()}`,
      date: date,
      provider: provider,
      doctor: doctor,
      type: recordType,
      fileType: fileType,
      fileSize: Math.floor(Math.random() * 10000) + 200,
      shared: Math.random() > 0.7,
      flagged: Math.random() > 0.8,
      notes: Math.random() > 0.6 ? "Important medical information included" : null
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date (newest first)
};

const MedicalRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<any>(null);
  
  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setRecords(generateMedicalRecords());
    }, 800);
  }, []);
  
  const filteredRecords = records
    .filter(record => 
      (filter === "all" || record.type === filter) &&
      (searchQuery === "" || 
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.type.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "provider") {
        comparison = a.provider.localeCompare(b.provider);
      } else if (sortBy === "type") {
        comparison = a.type.localeCompare(b.type);
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  
  const handleUpload = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newRecord = {
        id: `med-${records.length + 1}`,
        title: `New Upload - ${new Date().toLocaleDateString()}`,
        date: new Date(),
        provider: "Self Upload",
        doctor: "N/A",
        type: "Lab Result",
        fileType: "pdf",
        fileSize: 1458,
        shared: false,
        flagged: false,
        notes: null
      };
      
      setRecords([newRecord, ...records]);
      setIsUploading(false);
    }, 2000);
  };
  
  const toggleRecordSelection = (id: string) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };
  
  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    
    return (
      <span className="ml-1 text-foreground/50">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'jpg':
        return <FaFileImage className="text-blue-500" />;
      case 'csv':
        return <FaFileCsv className="text-green-500" />;
      default:
        return <FaFileAlt className="text-muted-foreground" />;
    }
  };
  
  const recordTypeFilters = ["all", ...Array.from(new Set(records.map(r => r.type)))];
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Medical Records</h1>
        <p className="text-muted-foreground">
          Access, manage, and share your medical records securely.
        </p>
      </div>
      
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search records..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-health-primary text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-muted-foreground" />
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`flex items-center px-4 py-2 bg-health-primary text-white rounded-lg hover:bg-health-primary/90 transition-colors ${isUploading ? 'opacity-75 cursor-wait' : ''}`}
          >
            <FaFileUpload className="mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Record'}
          </button>
          
          <button
            className={`flex items-center px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors ${selectedRecords.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedRecords.length === 0}
            onClick={() => setIsShareModalOpen(true)}
          >
            <FaShareAlt className="mr-2" />
            Share
          </button>
          
          <button
            className={`flex items-center px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors ${selectedRecords.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedRecords.length === 0}
          >
            <FaFileDownload className="mr-2" />
            Download
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-4 flex overflow-x-auto pb-2">
        {recordTypeFilters.map((type) => (
          <button
            key={type}
            className={`px-3 py-1 mx-1 rounded-full text-sm whitespace-nowrap ${
              filter === type 
                ? 'bg-health-primary/20 text-health-primary border border-health-primary/30' 
                : 'bg-background text-foreground border border-border hover:bg-muted'
            }`}
            onClick={() => setFilter(type)}
          >
            {type === "all" ? "All Records" : type}
          </button>
        ))}
      </div>
      
      {/* Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-health-primary"
                    checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={() => {
                      if (selectedRecords.length === filteredRecords.length) {
                        setSelectedRecords([]);
                      } else {
                        setSelectedRecords(filteredRecords.map(r => r.id));
                      }
                    }}
                  />
                </th>
                <th 
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <span className="flex items-center">
                    Record <SortIcon column="title" />
                  </span>
                </th>
                <th 
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <span className="flex items-center">
                    Date <SortIcon column="date" />
                  </span>
                </th>
                <th 
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("provider")}
                >
                  <span className="flex items-center">
                    Provider <SortIcon column="provider" />
                  </span>
                </th>
                <th 
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <span className="flex items-center">
                    Type <SortIcon column="type" />
                  </span>
                </th>
                <th className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {records.length === 0 ? 'Loading records...' : 'No records found matching your search.'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr 
                    key={record.id} 
                    className={`hover:bg-muted/50 ${selectedRecords.includes(record.id) ? 'bg-health-primary/10' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-health-primary"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => toggleRecordSelection(record.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getFileIcon(record.fileType)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{record.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {(record.fileSize / 1000).toFixed(1)} MB • {record.fileType.toUpperCase()}
                          </div>
                        </div>
                        {record.flagged && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-200/30 text-amber-800 border border-amber-300/30">
                            Important
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        {record.date.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {record.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">{record.provider}</div>
                      <div className="text-xs text-muted-foreground">{record.doctor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-health-primary/20 text-health-primary border border-health-primary/30">
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          className="text-health-primary hover:text-health-primary/80"
                          onClick={() => setViewingRecord(record)}
                        >
                          <FaEye />
                        </button>
                        <button className="text-foreground/70 hover:text-foreground">
                          <FaDownload />
                        </button>
                        <button className="text-foreground/70 hover:text-foreground">
                          <FaShareAlt />
                        </button>
                        <button className="text-foreground/70 hover:text-foreground">
                          <FaEllipsisV />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Record Details Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{viewingRecord.title}</h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setViewingRecord(null)}
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="flex flex-wrap -m-2">
                <div className="p-2 w-full md:w-1/2">
                  <div className="border border-border rounded-lg p-4 h-full bg-background/50">
                    <h3 className="font-medium text-foreground mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2 text-health-primary" /> Record Information
                    </h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                        <dd className="text-sm text-foreground">{viewingRecord.date.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Record Type</dt>
                        <dd className="text-sm text-foreground">{viewingRecord.type}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">File Details</dt>
                        <dd className="text-sm text-foreground">
                          {viewingRecord.fileType.toUpperCase()} • {(viewingRecord.fileSize / 1000).toFixed(1)} MB
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="p-2 w-full md:w-1/2">
                  <div className="border border-border rounded-lg p-4 h-full bg-background/50">
                    <h3 className="font-medium text-foreground mb-2 flex items-center">
                      <FaHospital className="mr-2 text-health-primary" /> Provider Information
                    </h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Provider</dt>
                        <dd className="text-sm text-foreground">{viewingRecord.provider}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Doctor</dt>
                        <dd className="text-sm text-foreground">{viewingRecord.doctor}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Sharing Status</dt>
                        <dd className="text-sm text-foreground flex items-center">
                          {viewingRecord.shared ? (
                            <span className="flex items-center text-green-500">
                              <FaShareAlt className="mr-1" /> Shared with providers
                            </span>
                          ) : (
                            <span className="flex items-center text-muted-foreground">
                              <FaLock className="mr-1" /> Not shared
                            </span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="p-2 w-full">
                  <div className="border border-border rounded-lg p-4 bg-background/50">
                    <h3 className="font-medium text-foreground mb-2 flex items-center">
                      <FaFileAlt className="mr-2 text-health-primary" /> Document Preview
                    </h3>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                      <div className="text-center">
                        <div className="flex justify-center mb-2 text-4xl">
                          {getFileIcon(viewingRecord.fileType)}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Preview not available. Click the button below to download the full document.
                        </p>
                        <button className="mt-4 flex items-center mx-auto px-4 py-2 bg-health-primary text-white rounded-lg hover:bg-health-primary/90 transition-colors">
                          <FaFileDownload className="mr-2" /> Download File
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between p-6 border-t border-border bg-background/50">
              <button
                className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                onClick={() => setViewingRecord(null)}
              >
                Close
              </button>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors flex items-center">
                  <FaShareAlt className="mr-2" /> Share Record
                </button>
                <button className="px-4 py-2 bg-health-primary text-white rounded-lg hover:bg-health-primary/90 transition-colors flex items-center">
                  <FaFileDownload className="mr-2" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-md border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Share Medical Records</h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsShareModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-4">
                Share {selectedRecords.length} selected record(s) with healthcare providers or family members.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-health-primary text-foreground"
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Access Level
                </label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-health-primary text-foreground">
                  <option>View only</option>
                  <option>View and download</option>
                  <option>Full access</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Expiration
                </label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-health-primary text-foreground">
                  <option>24 hours</option>
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>Never</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Message (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-health-primary text-foreground"
                  rows={3}
                  placeholder="Add a note to the recipient..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-border bg-background/50">
              <button
                className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors mr-2"
                onClick={() => setIsShareModalOpen(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-health-primary text-white rounded-lg hover:bg-health-primary/90 transition-colors">
                Share Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords; 