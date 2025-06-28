import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      // Use pdfjs-dist for better compatibility
      const pdfjsLib = await import("pdfjs-dist");

      // Set up the worker
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;

      let fullText = "";
      const numPages = pdf.numPages;

      // Extract text from each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine text items
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        fullText += pageText + "\n\n";
      }

      // Clean and format the text
      const content = fullText
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, "\n\n") // Replace multiple newlines with double newlines
        .trim();

      // Check if we got any meaningful content
      if (!content || content.length < 10) {
        return NextResponse.json(
          {
            error: "PDF appears to be empty or unreadable",
            details: "The PDF might be image-based or in an unsupported format",
            extractedLength: content.length,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        content,
        pages: numPages,
        info: { title: file.name },
        extractedLength: content.length,
      });
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);

      return NextResponse.json(
        {
          error: "Failed to parse PDF content",
          details:
            pdfError instanceof Error ? pdfError.message : "Unknown error",
          suggestion:
            "Try uploading a different PDF or use the text input option",
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
