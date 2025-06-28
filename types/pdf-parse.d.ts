declare module "pdf-parse" {
  interface PDFOptions {
    normalizeWhitespace?: boolean;
    disableCombineTextItems?: boolean;
  }

  interface PDFData {
    text: string;
    numpages: number;
    info: any;
  }

  function pdfParse(buffer: Buffer, options?: PDFOptions): Promise<PDFData>;
  export = pdfParse;
}

declare module "pdfjs-dist" {
  interface PDFDocument {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPage>;
  }

  interface PDFPage {
    getTextContent(): Promise<TextContent>;
  }

  interface TextContent {
    items: TextItem[];
  }

  interface TextItem {
    str: string;
  }

  interface GlobalWorkerOptions {
    workerSrc: any;
  }

  interface PDFLoadingTask {
    promise: Promise<PDFDocument>;
  }

  function getDocument(options: { data: Buffer }): PDFLoadingTask;

  const GlobalWorkerOptions: GlobalWorkerOptions;

  export { getDocument, GlobalWorkerOptions };
  export type { PDFDocument, PDFPage, TextContent, TextItem };
}

declare module "pdfjs-dist/build/pdf.worker.mjs" {
  const worker: any;
  export default worker;
}
