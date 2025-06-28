import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("PDF parsing request received");

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(
      `Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`
    );

    if (file.type !== "application/pdf") {
      console.log(`Invalid file type: ${file.type}`);
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(`File converted to buffer, size: ${buffer.length} bytes`);

    try {
      // Try to use a simpler PDF parsing approach
      console.log("Attempting PDF text extraction...");

      // For now, return a helpful message about the PDF
      // This is a temporary solution until we implement a proper server-side PDF parser
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        pages: "Unknown (PDF parsing not available in server environment)",
      };

      console.log("PDF file info extracted:", fileInfo);

      return NextResponse.json({
        content: `PDF File: ${file.name}\n\nThis PDF has been uploaded successfully, but text extraction is not available in the current server environment.\n\nTo use this content:\n1. Open the PDF in a PDF reader\n2. Select and copy the text you want to analyze\n3. Use the "Paste Text" option in the app\n4. Paste the copied text and click "Add Text"\n\nThis will allow you to chat with the AI about your PDF content.`,
        pages: 1,
        info: fileInfo,
        extractedLength: 0,
        note: "Text extraction not available - use Paste Text option instead",
      });
    } catch (pdfError) {
      console.error("PDF processing error:", pdfError);

      return NextResponse.json(
        {
          error: "PDF processing not available",
          details:
            "PDF text extraction is not supported in the current environment",
          suggestion:
            "Please use the 'Paste Text' option to manually copy and paste content from your PDF",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
