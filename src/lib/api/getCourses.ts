"use server";

interface Course {
  id: number;
  name: string;
}

interface ApiResponse {
  data: ApiCourse[];
}

interface ApiCourse {
  id: number;
  name: string;
  sort: number | null;
  date_created: string;
  date_updated: string | null;
}

export const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${process.env.BACKEND_URL}/items/courses`);
  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`);
  }
  const data: ApiResponse = await response.json();
  return data.data.map((course: ApiCourse) => ({
    id: course.id,
    name: course.name,
  }));
};
