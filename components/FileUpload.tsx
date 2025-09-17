import React, { useState, useCallback } from 'react';
import { UploadIcon, FileIcon } from './icons';

interface FileUploadProps {
  onFileProcess: (data: any[][]) => void;
  setProcessingError: (error: string | null) => void;
}

declare const XLSX: any; // Using the global XLSX from the script tag in index.html

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess, setProcessingError }) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setProcessingError(null);
    setFileName(null);
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          onFileProcess(json);
          setFileName(file.name);
        } catch (err) {
          console.error("Error processing Excel file:", err);
          setProcessingError('엑셀 파일 처리 중 오류가 발생했습니다. 파일 형식이 올바른지 확인해주세요.');
        }
      };
      reader.onerror = () => {
        setProcessingError('파일을 읽는 중 오류가 발생했습니다.');
      }
      reader.readAsBinaryString(file);
    } else {
      setProcessingError('올바른 엑셀 파일(.xlsx)을 업로드해주세요.');
    }
  }, [onFileProcess, setProcessingError]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">1. 교육과정 정보 가져오기</h2>
      <p className="text-gray-600 mb-4">지정된 양식의 엑셀(.xlsx) 파일을 업로드하여 교육과정을 등록합니다.<br/>(첫 행은 헤더로 인식되며, A열: 과목명, B열: 총 이수 시간)</p>
      
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
          <UploadIcon className="w-12 h-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">파일 선택</span> 또는 드래그 앤 드롭
          </p>
          <p className="text-xs text-gray-500 mt-1">XLSX (Excel 파일)</p>
        </label>
      </div>
      
      {fileName && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md flex items-center justify-between">
            <div className="flex items-center">
                <FileIcon className="w-5 h-5 text-green-700 mr-2"/>
                <span className="text-sm text-green-800 font-medium">{fileName} 파일이 성공적으로 처리되었습니다.</span>
            </div>
        </div>
      )}
    </div>
  );
};
