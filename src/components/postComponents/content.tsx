"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { getauth } from "@/lib/getAuth";

interface ContentProps {
  onContentChange: (content: string) => void;
}

interface UploaderResponse {
  data?: {
    url: string;
  };
}

const Content: React.FC<ContentProps> = ({ onContentChange }) => {
  const [content, setContent] = useState<string>("");
  const editorRef = useRef<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthToken = async () => {
      const token = await getauth();
      setAuthToken(token);
    };
    fetchAuthToken();
  }, []);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      minHeight: 500,
      uploader: {
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/files`,
        format: "json",
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        prepareData: (formData: FormData) => {
          const file = formData.get("files[0]");
          formData.delete("files[0]");
          if (file instanceof File) {
            formData.append("file", file);
          }
          return formData;
        },
        isSuccess: (resp: UploaderResponse) => {
          return resp && resp.data && resp.data.url;
        },
        getMsg: (resp: UploaderResponse) => {
          return resp && resp.data
            ? "File uploaded successfully"
            : "Upload failed";
        },
        process: (resp: UploaderResponse) => {
          if (resp && resp.data && resp.data.url) {
            const fileUrl = resp.data.url;
            return {
              files: [fileUrl],
              path: fileUrl,
              baseurl: fileUrl,
              message: "File uploaded successfully",
            };
          }
          return resp;
        },
        defaultHandlerError: (e: unknown) => {
          console.error("Upload error:", e);
        },
        defaultHandlerSuccess: function (
          this: any,
          data: { files?: string[] },
          resp: unknown,
        ) {
          if (data.files && data.files.length) {
            for (let i = 0; i < data.files.length; i += 1) {
              this.s.insertImage(data.files[i]);
            }
          }
        },
      },
    }),
    [authToken],
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  return (
    <div>
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        onChange={handleContentChange}
      />
    </div>
  );
};

export default Content;
