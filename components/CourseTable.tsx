import React from 'react';
import type { Course } from '../types';
import { TrashIcon } from './icons';

interface CourseTableProps {
  courses: Course[];
  onClear: () => void;
  onPrerequisiteChange: (courseId: string, prerequisiteId: string | null) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({ courses, onClear, onPrerequisiteChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">등록된 교육과정 목록</h2>
        {courses.length > 0 && (
            <button 
                onClick={onClear} 
                className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
                <TrashIcon className="w-4 h-4 mr-2" />
                전체 삭제
            </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {courses.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  과목명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  총 이수 시간
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  선수 과목 설정
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course, index) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{course.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{course.hours} 시간</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <select
                      value={course.prerequisiteId || ''}
                      onChange={(e) => onPrerequisiteChange(course.id, e.target.value || null)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      aria-label={`${course.name}의 선수 과목 선택`}
                    >
                      <option value="">없음</option>
                      {courses
                        .filter(p => p.id !== course.id) // Cannot be its own prerequisite
                        .map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">등록된 교육과정이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-1">엑셀 파일을 업로드하여 교육과정을 추가해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};