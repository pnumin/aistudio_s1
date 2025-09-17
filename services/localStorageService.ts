import type { Course } from '../types';

const COURSES_KEY = 'navy_timetable_courses';

export const getCourses = (): Course[] => {
  try {
    const coursesJson = localStorage.getItem(COURSES_KEY);
    return coursesJson ? JSON.parse(coursesJson) : [];
  } catch (error) {
    console.error("Error fetching courses from local storage:", error);
    return [];
  }
};

export const saveCourses = (courses: Course[]): void => {
  try {
    const coursesJson = JSON.stringify(courses);
    localStorage.setItem(COURSES_KEY, coursesJson);
  } catch (error) {
    console.error("Error saving courses to local storage:", error);
  }
};

export const clearAllData = (): void => {
    try {
        localStorage.removeItem(COURSES_KEY);
        // Can add other keys to remove here in the future
    } catch (error) {
        console.error("Error clearing data from local storage:", error);
    }
}
