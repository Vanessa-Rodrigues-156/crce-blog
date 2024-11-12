import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

// Constants for bucket and endpoint
const BUCKET_NAME = "b1";
const S3_ENDPOINT = "https://pbrondzzypuykhjrlheo.supabase.co/storage/v1/s3";

// Initialize the S3 client
const client = new S3Client({
  forcePathStyle: true,
  region: "ap-south-1",
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: "acb3fe1e5bff8e3844e119f95550cf87",
    secretAccessKey:
      "20078f1157cdb5ffec93d5611d542a49ef67c3ca14e86a57d10e05171d43c9af",
  },
});

/**
 * GET request handler to retrieve the file by its ID and send the file as a response
 * @param request - The request object
 * @param params - The params object containing the id path parameter
 * @returns The file as a response stream
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const fileId = params.id;

    if (!fileId) {
      return new Response(JSON.stringify({ error: "Missing fileId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileKey = fileId; // Using the fileId directly as the key in S3

    // Create S3 command to retrieve the object
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    // Fetch the file from S3
    const s3Response = await client.send(command);

    if (!s3Response.Body) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert the Readable stream to a web-compatible ReadableStream
    const stream = s3Response.Body as Readable;
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (error) => controller.error(error));
      },
    });

    // Return the file as a streamed response
    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": s3Response.ContentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileId}"`, // Defaulting to fileId as filename
      },
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return new Response(JSON.stringify({ error: "File retrieval failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
