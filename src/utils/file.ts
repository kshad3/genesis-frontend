import mammoth from "mammoth";

export const readFileContent = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // if pdf
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) {
          return resolve("");
        }
        try {
          const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
          const pdfDoc = await window.pdfjsLib.getDocument({ data: typedArray })
            .promise;
          let textContent = "";
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const text = await page.getTextContent();
            const pageText = text.items.map((item: any) => item.str).join(" ");
            textContent += pageText + " ";
          }
          return resolve(textContent);
        } catch (err) {
          return resolve("");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    // if docx
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) {
          return resolve("");
        }
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: e.target.result as ArrayBuffer,
          });
          return resolve(result.value);
        } catch (err) {
          return resolve("");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    // if txt or csv
    if (file.type === "text/plain" || file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) {
          return resolve("");
        }
        return resolve(e.target.result as string);
      };
      reader.readAsText(file);
    }
  });
};
