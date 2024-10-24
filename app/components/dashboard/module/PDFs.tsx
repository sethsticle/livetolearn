"use client"
import { pdfDataType } from '@/app/dashboard/courses/[courseId]/module/[slug]/oldPage'
import React, { useEffect, useState } from 'react'

function PDFs({pdfData}: {pdfData: pdfDataType[]}) {
  
    // const [pdfs, setPdfs] = useState([]);

    // useEffect(() => {
    //   // Simulate a fetch request to get PDF links from the database
    //   setPdfs(pdfData);
    // }, []);

  
    return (
      <div className='border border-blue-400 '>
    <ul className="list-disc pl-5">
          {pdfData.map((pdf) => (
            <li key={pdf.id}>
              <a href={pdf.pdf_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">
                {pdf.title}
              </a>
              <hr className='my-2'/>
            </li>
          ))}
        </ul>
      </div>
  )
}

export default PDFs