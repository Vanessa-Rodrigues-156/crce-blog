"use client";
import { motion } from "framer-motion";
import { getauth } from "@/lib/getAuth";
import { checkUsername } from "@/lib/getUser";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchCourses } from "@/lib/api/getCourses";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";

const Content = dynamic(() => import("./postComponents/content"), {
  ssr: false,
});

const AddPost = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [post, setPost] = useState({
    title: "",
    content: "",
    description: "",
    courseName: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    description: "",
    courseName: "",
    file: "",
  });

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

  const validateStep1 = () => {
    const newErrors = {
      title: post.title ? "" : "Title is required.",
      description: post.description ? "" : "Description is required.",
      courseName: post.courseName ? "" : "Course selection is required.",
      file: file ? "" : "Image upload is required.",
      content: "", // Add this line to include the content property
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };
  const validateStep2 = () => {
    const newErrors = {
      content: post.content ? "" : "Content is required.",
    };
    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleContentChange = (newContent: string) => {
    setPost({ ...post, content: newContent });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      try {
        const authToken = await getauth();
        const username = await checkUsername();
        let imageId = null;
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          const imageResponse = await fetch("http://localhost:3000/files", {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `bearer ${authToken}`,
            },
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            imageId = imageData.data.id;
          } else {
            throw new Error("Failed to upload image");
          }
        }

        const postData = {
          status: "published",
          title: post.title,
          description: post.description,
          content: post.content,
          image: imageId,
          user: username,
          courseName: post.courseName,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/items/posts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(postData),
          },
        );

        if (response.ok) {
          router.push("/");
        } else {
          console.error("Failed to submit post");
        }
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {step === 1 ? "Create New Post" : "Write Your Post"}
            </h2>
            <div className="mb-8">
              <div className="flex items-center">
                <div
                  className={`w-1/2 h-1 ${step === 1 ? "bg-indigo-600" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`w-1/2 h-1 ${step === 2 ? "bg-indigo-600" : "bg-gray-200"}`}
                ></div>
              </div>
            </div>
            {step === 1 ? (
              <form>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Enter your post title..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      onChange={handleChange}
                      value={post.title}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      placeholder="Write your description here which will be visible on the thumbnail..."
                      onChange={handleChange}
                      value={post.description}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="file"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150 ease-in-out"
                    />
                    {errors.file && (
                      <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select a Course
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setPost({ ...post, courseName: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.name}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.courseName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.courseName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    Next
                  </motion.button>
                </div>
              </form>
            ) : (
              <div>
                <Content onContentChange={handleContentChange} />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.content}</p>
                )}
                <div className="mt-8 space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    Submit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                  >
                    Back
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddPost;
