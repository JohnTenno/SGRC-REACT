import html2canvas from 'html2canvas'
import { toCanvas } from 'html-to-image'
import { jsPDF } from 'jspdf'

/**
 * @param {HTMLElement} root
 */
async function waitForImages(root) {
  const images = root.querySelectorAll('img')
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve()
            return
          }
          img.onload = () => resolve()
          img.onerror = () => resolve()
        }),
    ),
  )
}

/**
 * @param {HTMLElement} element
 * @param {import('html2canvas').Options} [options]
 */
export async function captureElementAsCanvas(element, options = {}) {
  await waitForImages(element)

  try {
    return await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      ...options,
    })
  } catch (html2canvasError) {
    console.warn('html2canvas falló, usando html-to-image:', html2canvasError)
    await waitForImages(element)
    return toCanvas(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight,
    })
  }
}

/**
 * @param {HTMLElement} element
 * @param {string} filename
 */
export async function downloadElementAsPng(element, filename) {
  const canvas = await captureElementAsCanvas(element)
  const dataUrl = canvas.toDataURL('image/png')

  const link = document.createElement('a')
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * @param {HTMLElement} element
 * @param {string} filename
 */
export async function downloadElementAsPdf(element, filename) {
  const canvas = await captureElementAsCanvas(element)
  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 12
  const maxWidth = pageWidth - margin * 2
  const maxHeight = pageHeight - margin * 2

  let imgWidth = maxWidth
  let imgHeight = (canvas.height * imgWidth) / canvas.width

  if (imgHeight > maxHeight) {
    imgHeight = maxHeight
    imgWidth = (canvas.width * imgHeight) / canvas.height
  }

  const x = (pageWidth - imgWidth) / 2
  pdf.addImage(imgData, 'PNG', x, margin, imgWidth, imgHeight)
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}
