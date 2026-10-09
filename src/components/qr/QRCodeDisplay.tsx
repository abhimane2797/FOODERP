import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { Download, Printer, Eye } from 'lucide-react'
import { Button } from '../ui'
import { clsx } from '../../utils'

interface QRCodeDisplayProps {
  /** The absolute URL encoded into the QR code. */
  value: string
  /** Rendered pixel size of the QR symbol (not counting quiet zone). */
  size?: number
  /** Caption shown under the QR (e.g. "Table 12"). */
  caption?: string
  /** Small sub-caption (e.g. "Demo Restaurant"). */
  subcaption?: string
  /** Show the Download / Print / View action bar. */
  showActions?: boolean
  className?: string
}

/**
 * Renders a *real*, scannable QR code from `value` (an absolute URL
 * produced by `getQRMenuUrl`).  Canvas-based so we can trivially export
 * a PNG for Download and print via a hidden iframe.
 */
export function QRCodeDisplay({
  value,
  size = 180,
  caption,
  subcaption,
  showActions = false,
  className,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    setError(null)
    QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Failed to generate QR')
    })
  }, [value, size])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-${caption?.replace(/\s+/g, '-').toLowerCase() || 'code'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [caption])

  const handlePrint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const win = window.open('', '_blank', 'width=420,height=620')
    if (!win) return
    win.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${caption ?? 'QR Code'} — Spice Garden</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: Inter, system-ui, sans-serif; display:flex;
                   flex-direction:column; align-items:center; justify-content:center;
                   min-height:100vh; padding:32px; color:#0f172a; }
            .card { border:1px solid #e2e8f0; border-radius:16px; padding:28px;
                    text-align:center; width:320px; }
            .brand { font-size:18px; font-weight:700; margin-bottom:4px; }
            .sub { font-size:12px; color:#64748b; margin-bottom:18px; }
            img { width:220px; height:220px; image-rendering: pixelated; }
            .table { font-size:16px; font-weight:700; margin-top:16px; }
            .hint { font-size:11px; color:#94a3b8; margin-top:6px; }
            .url { font-size:10px; color:#94a3b8; margin-top:10px; word-break:break-all; }
            @media print { body { padding:0; } .card { border:none; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">Spice Garden</div>
            <div class="sub">Scan to view menu &amp; order</div>
            <img src="${dataUrl}" alt="QR code" />
            <div class="table">${caption ?? ''}</div>
            <div class="hint">${subcaption ?? ''}</div>
            <div class="url">${value}</div>
          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `)
    win.document.close()
  }, [caption, subcaption, value])

  return (
    <div className={clsx('flex flex-col items-center gap-3', className)}>
      {/* The symbol */}
      <div
        className="relative bg-white rounded-2xl border border-surface-200 p-3 shadow-xs"
        style={{ width: size + 24, height: size + 24 }}
      >
        <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block' }} />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-danger-600 p-3 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Caption */}
      {(caption || subcaption) && (
        <div className="text-center">
          {subcaption && <p className="text-xs text-surface-500">{subcaption}</p>}
          {caption && <p className="text-sm font-bold text-surface-900">{caption}</p>}
        </div>
      )}

      {/* URL readout — makes it obvious what's encoded */}
      <p className="text-[10px] font-mono text-surface-400 text-center max-w-[240px] break-all leading-tight">
        {value}
      </p>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 mt-1">
          <Button size="sm" variant="outline" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => window.open(value, '_blank')}>
            View
          </Button>
          <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={handleDownload}>
            Download
          </Button>
          <Button size="sm" variant="outline" icon={<Printer className="w-3.5 h-3.5" />} onClick={handlePrint}>
            Print
          </Button>
        </div>
      )}
    </div>
  )
}
