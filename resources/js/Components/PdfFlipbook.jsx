import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const FlipPage = forwardRef(({ src, pageNumber, totalPages }, ref) => (
    <div ref={ref} className="flipbook-page bg-white">
        <div className="flipbook-page-inner">
            {src ? (
                <img src={src} alt={`Halaman ${pageNumber}`} className="flipbook-page-image" draggable={false} />
            ) : (
                <div className="flex h-full items-center justify-center text-gray-400">Memuat...</div>
            )}
            <span className="flipbook-page-number">{pageNumber} / {totalPages}</span>
        </div>
    </div>
));

FlipPage.displayName = 'FlipPage';

function resolvePdfUrl(url) {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`;
}

async function loadPdfDocument(pdfUrl) {
    const absoluteUrl = resolvePdfUrl(pdfUrl);
    const response = await fetch(absoluteUrl, {
        credentials: 'same-origin',
        headers: { Accept: 'application/pdf' },
    });

    if (!response.ok) {
        throw new Error(`File PDF tidak dapat diakses (HTTP ${response.status}).`);
    }

    const data = await response.arrayBuffer();

    return getDocument({
        data,
        cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/standard_fonts/`,
    }).promise;
}

export default function PdfFlipbook({ pdfUrl, title = 'Dokumen' }) {
    const bookRef = useRef(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [bookSize, setBookSize] = useState({ width: 420, height: 560 });

    const updateBookSize = useCallback(() => {
        const container = document.getElementById('flipbook-container');
        if (!container) return;

        const maxWidth = Math.min(container.clientWidth - 32, 520);
        const width = Math.max(280, maxWidth);
        const height = Math.round(width * 1.414);

        setBookSize({ width, height });
    }, []);

    useEffect(() => {
        updateBookSize();
        window.addEventListener('resize', updateBookSize);
        return () => window.removeEventListener('resize', updateBookSize);
    }, [updateBookSize]);

    useEffect(() => {
        if (!pdfUrl) return;

        let cancelled = false;

        const loadPdf = async () => {
            setLoading(true);
            setError(null);
            setPages([]);
            setCurrentPage(0);

            try {
                const pdf = await loadPdfDocument(pdfUrl);
                const rendered = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    if (cancelled) return;

                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.35 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport, canvas }).promise;
                    rendered.push(canvas.toDataURL('image/jpeg', 0.88));
                }

                if (!cancelled) {
                    setPages(rendered);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('PDF flipbook error:', err);
                    setError(err?.message || 'Gagal memuat dokumen PDF. Pastikan file dapat diakses.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadPdf();

        return () => {
            cancelled = true;
        };
    }, [pdfUrl]);

    const handleFlip = (e) => {
        setCurrentPage(e.data);
    };

    const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
    const goNext = () => bookRef.current?.pageFlip()?.flipNext();

    if (loading) {
        return (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-100 p-8">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
                <p className="mt-4 text-sm font-semibold text-green-800">Memuat flipbook...</p>
                <p className="mt-1 text-xs text-green-600">{title}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="text-sm font-medium text-red-700">{error}</p>
                <a href={resolvePdfUrl(pdfUrl)} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm text-green-700 underline">
                    Buka PDF langsung
                </a>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-8">
                <p className="text-sm text-gray-500">Dokumen PDF tidak memiliki halaman.</p>
            </div>
        );
    }

    return (
        <div className="flipbook-wrapper">
            <div id="flipbook-container" className="flipbook-container">
                <HTMLFlipBook
                    ref={bookRef}
                    width={bookSize.width}
                    height={bookSize.height}
                    size="stretch"
                    minWidth={280}
                    maxWidth={520}
                    minHeight={396}
                    maxHeight={735}
                    showCover={false}
                    mobileScrollSupport
                    className="flipbook-book"
                    onFlip={handleFlip}
                    usePortrait
                    drawShadow
                    flippingTime={800}
                    startPage={0}
                >
                    {pages.map((src, index) => (
                        <FlipPage
                            key={index}
                            src={src}
                            pageNumber={index + 1}
                            totalPages={pages.length}
                        />
                    ))}
                </HTMLFlipBook>
            </div>

            <div className="flipbook-controls">
                <button type="button" onClick={goPrev} disabled={currentPage <= 0} className="flipbook-btn">
                    ← Sebelumnya
                </button>
                <span className="flipbook-status">
                    Halaman {Math.min(currentPage + 1, pages.length)} dari {pages.length}
                </span>
                <button type="button" onClick={goNext} disabled={currentPage >= pages.length - 1} className="flipbook-btn">
                    Selanjutnya →
                </button>
                <a href={resolvePdfUrl(pdfUrl)} target="_blank" rel="noopener noreferrer" className="flipbook-download">
                    Unduh PDF
                </a>
            </div>
        </div>
    );
}
