"use client";
import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { Eye, Trash2 } from "lucide-react";
import { isTeacherCookieValid } from "@/lib/isTeacher";
import { useRouter } from "next/navigation";
import { updatePostStatusOnServer } from "@/lib/api/updatePosts";
import { fetchPosts } from "@/lib/api/getPosts";
import { fetchCourses } from "@/lib/api/getCourses";
import { deletePostOnServer } from "@/lib/api/deletePost";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import AlertDialog from "@/components/alertDialog";

interface Post {
  id: number;
  title: string;
  imageUrl: string;
  views: number;
  valid: boolean;
  user: string;
  courseName: string;
}

interface BlogDisplayCardProps {
  posts: Post[];
  courseNames: { id: number; name: string }[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const BlogDisplayCard: React.FC<BlogDisplayCardProps> = ({
  posts,
  courseNames,
  setPosts,
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const updateLocalPostStatus = (id: number, valid: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === id ? { ...post, valid } : post)),
    );
  };

  const updatePostStatus = async (id: number, valid: boolean) => {
    updateLocalPostStatus(id, valid);
    try {
      await updatePostStatusOnServer(id, valid);
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      await deletePostOnServer(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 py-10 font-serif text-center">
        Posts To Be Approved
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="text-lg">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={`border rounded-lg shadow-md overflow-hidden flex flex-col justify-between ${
                post.valid ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full cursor-pointer h-48 object-cover"
                onClick={() => {
                  router.push(`${post.id}`);
                }}
              />
              <div
                className="p-4 cursor-pointer flex-grow"
                onClick={() => {
                  router.push(`${post.id}`);
                }}
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.user}</p>
                <p className="text-gray-600 mb-2">
                  Course Name:{" "}
                  <span className="font-medium">{post.courseName}</span>
                </p>
              </div>
              <div className="flex justify-between p-4 bg-gray-100">
                <button
                  onClick={() => updatePostStatus(post.id, true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => updatePostStatus(post.id, false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setPostToDelete(post.id);
                    setIsAlertOpen(true);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => {
          if (postToDelete !== null) {
            deletePost(postToDelete);
          }
          setIsAlertOpen(false);
        }}
        title="Are you sure you want to delete this post?"
        description="This action cannot be undone. This will permanently delete the post."
      />
    </div>
  );
};

const Page = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    loadCourses();
  }, []);

  const handleFetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await fetchPosts(
        selectedCourse !== "All" && selectedCourse ? selectedCourse : undefined,
      );
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [selectedCourse]);

  useLayoutEffect(() => {
    const loadPosts = async () => {
      const isTeacher = await isTeacherCookieValid();
      if (!isTeacher) {
        // router.push("/");
        return;
      }
      handleFetchPosts();
    };
    loadPosts();
  }, [router, handleFetchPosts]);

  return (
    <div className="mt-32">
      <div className="p-4">
        <Select onValueChange={(value) => setSelectedCourse(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key="All" value="All">
                All
              </SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.name}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <button
          onClick={handleFetchPosts}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        >
          Fetch
        </button>
      </div>
      <BlogDisplayCard
        posts={posts}
        courseNames={courses}
        setPosts={setPosts}
      />
    </div>
  );
};

export default Page;
