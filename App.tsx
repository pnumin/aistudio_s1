import React, { useState, useEffect, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { CourseTable } from './components/CourseTable';
import type { Course } from './types';
import { getCourses, saveCourses, clearAllData } from './services/localStorageService';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load courses from local storage on initial render
    setCourses(getCourses());
  }, []);

  const handleFileProcess = useCallback((data: any[][]) => {
    setError(null);
    if (data.length < 2) {
      setError("엑셀 파일에 데이터가 없습니다. (헤더 포함 최소 2줄 필요)");
      return;
    }

    // Skip header row (index 0)
    // FIX: Add explicit return type `Course | null` to the map function to satisfy the type predicate in the filter function.
    const newCourses: Course[] = data.slice(1)
      .map((row, index): Course | null => {
        const name = row[0];
        const hours = parseInt(row[1], 10);
        
        if (name && !isNaN(hours) && hours > 0) {
          return {
            id: `${Date.now()}-${index}`, // Simple unique ID
            name: String(name).trim(),
            hours,
            prerequisiteId: null, // Initialize prerequisite
          };
        }
        return null;
      })
      .filter((course): course is Course => course !== null);

    if (newCourses.length === 0) {
        setError("유효한 과목 데이터를 찾을 수 없습니다. A열에 과목명, B열에 숫자로 된 이수 시간을 확인해주세요.");
        return;
    }
      
    // For this requirement, we replace existing courses with the new upload.
    saveCourses(newCourses);
    setCourses(newCourses);
  }, []);

  const handleClearCourses = useCallback(() => {
    if (window.confirm('정말로 모든 교육과정 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        clearAllData();
        setCourses([]);
        setError(null);
    }
  }, []);

  const handlePrerequisiteChange = useCallback((courseId: string, prerequisiteId: string | null) => {
    setCourses(prevCourses => {
        const updatedCourses = prevCourses.map(course => 
            course.id === courseId 
                ? { ...course, prerequisiteId: prerequisiteId } 
                : course
        );
        saveCourses(updatedCourses); // Save changes to local storage
        return updatedCourses;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-blue-700">해군교육사령부</span> 시간표 생성 시스템 (독립형)
          </h1>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
              <p className="font-bold">오류</p>
              <p>{error}</p>
            </div>
          )}

          <FileUpload onFileProcess={handleFileProcess} setProcessingError={setError} />
          
          <CourseTable 
            courses={courses} 
            onClear={handleClearCourses} 
            onPrerequisiteChange={handlePrerequisiteChange}
          />
          
        </div>
      </main>
        
      <footer className="bg-white mt-8">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} 해군교육사령부. 모든 데이터는 사용자 브라우저에만 저장됩니다.</p>
          </div>
      </footer>
    </div>
  );
};

export default App;