import { backendClient } from "@/lib/edgestore-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the formData from the request
    const formData = await req.formData();
    const file = formData.getAll("file")[0] as File; // Explicitly cast the file to a File type

    // Ensure the file exists and is of the correct type
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No valid file uploaded" },
        { status: 400 },
      );
    }

    // Create a BlobContent with the file's content
    const blobContent = new Blob([await file.arrayBuffer()], {
      type: file.type,
    });
    console.log(file.type); // This should now correctly output the file's MIME type

    // Upload the file using backendClient.publicFiles.upload
    const res = await backendClient.publicFiles.upload({
      content: {
        blob: blobContent, // Wrap the file content in a Blob
        extension: file.name.split(".").pop() || "", // Get the file extension
      },
    });

    // Check if the upload was successful and return the URL from the response
    if (res && res.url) {
      return NextResponse.json({ data: { url: res.url } });
    } else {
      return NextResponse.json(
        { error: "File upload failed" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
