import { useCallback, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
const resizeObserverOptions = {};

const maxWidth = 800;

const PdfViewer = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  //const pdfUrl = process.env.NEXT_PUBLIC_PDF_URL || "";
  const [pdfUrl, setPdfUrl]=useState<string>("");
  useEffect(()=> {
    setPdfUrl(process.env.NEXT_PUBLIC_PDF_URL || "");
  }, [])
  return (
    <>
      <div className='hereeeeee'>
       
        <div className="" ref={setContainerRef}>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
               width={containerWidth}
               
              />
            ))}
          </Document>
        </div>
      </div>
    </>
  );
};

export default PdfViewer;
