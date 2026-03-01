import jsPDF from "jspdf";

/** Generic CSV export – works for any array of flat objects */
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = String(row[h] ?? "");
      return `"${val.replace(/"/g, '""')}"`;
    }).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  downloadBlob(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

/** Export a table-like dataset to PDF using jsPDF */
export function exportToPDF(
  data: Record<string, unknown>[],
  filename: string,
  title: string
) {
  if (data.length === 0) return;
  const doc = new jsPDF({ orientation: "landscape" });
  const headers = Object.keys(data[0]);
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 24);

  // Table header
  const colWidth = (pageWidth - 28) / headers.length;
  let y = 32;

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  headers.forEach((h, i) => {
    doc.text(h, 14 + i * colWidth, y, { maxWidth: colWidth - 2 });
  });
  y += 6;
  doc.setFont("helvetica", "normal");

  // Rows
  data.forEach((row) => {
    if (y > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      y = 18;
    }
    headers.forEach((h, i) => {
      const val = String(row[h] ?? "").substring(0, 40);
      doc.text(val, 14 + i * colWidth, y, { maxWidth: colWidth - 2 });
    });
    y += 5;
  });

  doc.save(`${filename}.pdf`);
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
