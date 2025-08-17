import jsPDF from "jspdf"
import Papa from "papaparse"

export interface ExportOptions {
  filename?: string
  title?: string
  headers?: string[]
}

export function exportToCSV<T extends Record<string, any>>(data: T[], options: ExportOptions = {}) {
  const { filename = "export.csv" } = options

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })

  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPDF<T extends Record<string, any>>(data: T[], options: ExportOptions = {}) {
  const { filename = "export.pdf", title = "Export", headers } = options

  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text(title, 20, 20)

  // Add date
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)

  let yPosition = 50

  if (data.length > 0) {
    const keys = headers || Object.keys(data[0])

    // Add headers
    doc.setFontSize(12)
    keys.forEach((key, index) => {
      doc.text(key, 20 + index * 40, yPosition)
    })

    yPosition += 10

    // Add data rows
    doc.setFontSize(10)
    data.forEach((row, rowIndex) => {
      if (yPosition > 280) {
        // New page if needed
        doc.addPage()
        yPosition = 20
      }

      keys.forEach((key, colIndex) => {
        const value = String(row[key] || "")
        doc.text(value.substring(0, 20), 20 + colIndex * 40, yPosition)
      })

      yPosition += 8
    })
  }

  doc.save(filename)
}
