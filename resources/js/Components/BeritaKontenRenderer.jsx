const FOTO_PLACEHOLDER = /\[\[foto([1-5])\]\]/i;

const LAYOUT_CYCLE = ['right', 'left', 'full', 'right', 'left'];

function layoutForIndex(index) {
    return LAYOUT_CYCLE[index % LAYOUT_CYCLE.length];
}

function NewspaperPhoto({ url, index, layout = 'right', breakout = false }) {
    const caption = `Dokumentasi kegiatan HDDAP — foto ${index}`;

    const frameClass = breakout
        ? 'my-5 [column-span:all] clear-both w-full border-y-2 border-gray-900 py-1'
        : 'my-1 mb-3 break-inside-avoid';

    if (layout === 'right' && !breakout) {
        return (
            <figure className={`${frameClass} float-right ml-5 w-[46%] max-w-[240px] sm:max-w-[280px]`}>
                <div className="border border-gray-900 bg-white p-1 shadow-sm">
                    <img
                        src={url}
                        alt={caption}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                    />
                </div>
                <figcaption className="mt-1.5 text-[10px] leading-snug text-gray-500">
                    {caption}
                </figcaption>
            </figure>
        );
    }

    if (layout === 'left' && !breakout) {
        return (
            <figure className={`${frameClass} float-left mr-5 w-[46%] max-w-[240px] sm:max-w-[280px]`}>
                <div className="border border-gray-900 bg-white p-1 shadow-sm">
                    <img
                        src={url}
                        alt={caption}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                    />
                </div>
                <figcaption className="mt-1.5 text-[10px] leading-snug text-gray-500">
                    {caption}
                </figcaption>
            </figure>
        );
    }

    return (
        <figure className={frameClass}>
            <div className="overflow-hidden border-2 border-gray-900 bg-white">
                <img
                    src={url}
                    alt={caption}
                    className="h-48 w-full object-cover sm:h-56"
                    loading="lazy"
                />
            </div>
            <figcaption className="mt-2 border-l-4 border-green-700 pl-2 text-[11px] italic text-gray-600">
                {caption}
            </figcaption>
        </figure>
    );
}

function LeadParagraph({ content }) {
    const text = content.trim();
    if (!text) {
        return null;
    }

    const firstChar = text.charAt(0);
    const remainder = text.slice(1);

    return (
        <p className="font-serif text-[15px] leading-[1.9] text-justify text-gray-800">
            <span
                aria-hidden="true"
                className="float-left mr-2 mt-1 font-serif text-[3.4rem] font-bold leading-[0.78] text-green-800"
            >
                {firstChar}
            </span>
            {remainder}
        </p>
    );
}

function BodyParagraph({ content }) {
    if (!content?.trim()) {
        return null;
    }

    return (
        <p className="mb-4 break-inside-avoid font-serif text-[14px] leading-[1.85] text-justify text-gray-700">
            {content.trim()}
        </p>
    );
}

function buildPhotoMap(fotoKegiatan = []) {
    const map = {};
    (fotoKegiatan ?? []).forEach((url, index) => {
        if (url) {
            map[index + 1] = url;
        }
    });

    return map;
}

function planPhotoPlacements(paragraphCount, photoCount) {
    const placements = [];

    for (let i = 0; i < photoCount; i++) {
        const layout = layoutForIndex(i);
        const afterParagraph = paragraphCount === 0
            ? -1
            : Math.min(
                paragraphCount - 1,
                Math.floor(((i + 1) * paragraphCount) / (photoCount + 1)),
            );

        placements.push({
            photoIndex: i,
            afterParagraph,
            layout,
            breakout: layout === 'full',
        });
    }

    return placements;
}

function photosBeforeParagraph(placements, photos, paragraphIndex) {
    return placements.filter(
        (placement) => !placement.breakout && placement.afterParagraph === paragraphIndex - 1,
    ).map((placement) => ({
        ...placement,
        url: photos[placement.photoIndex],
    })).filter((item) => item.url);
}

function photosAfterParagraph(placements, photos, paragraphIndex) {
    return placements.filter(
        (placement) => placement.breakout && placement.afterParagraph === paragraphIndex,
    ).map((placement) => ({
        ...placement,
        url: photos[placement.photoIndex],
    })).filter((item) => item.url);
}

function renderWithPlaceholders(konten, photoMap) {
    const parts = konten.split(/(\[\[foto[1-5]\]\])/gi);
    let photoCounter = 0;

    return parts.map((part, index) => {
        const match = part.match(FOTO_PLACEHOLDER);
        if (match) {
            const slot = Number.parseInt(match[1], 10);
            const url = photoMap[slot];
            if (!url) {
                return null;
            }

            const layout = layoutForIndex(photoCounter);
            photoCounter += 1;

            return (
                <NewspaperPhoto
                    key={`foto-${index}`}
                    url={url}
                    index={slot}
                    layout={layout}
                    breakout={layout === 'full'}
                />
            );
        }

        if (index === 0) {
            return <LeadParagraph key={`text-${index}`} content={part} />;
        }

        return <BodyParagraph key={`text-${index}`} content={part} />;
    });
}

function renderNewspaperLayout(konten, fotoKegiatan = []) {
    const paragraphs = konten.split(/\n\n+/).filter((part) => part.trim());
    const photos = (fotoKegiatan ?? []).filter(Boolean);

    if (paragraphs.length === 0 && photos.length === 0) {
        return null;
    }

    if (paragraphs.length === 0) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {photos.map((url, index) => (
                    <NewspaperPhoto
                        key={`solo-${index}`}
                        url={url}
                        index={index + 1}
                        layout="full"
                        breakout
                    />
                ))}
            </div>
        );
    }

    const placements = planPhotoPlacements(paragraphs.length, photos.length);
    const lead = paragraphs[0];
    const bodyParagraphs = paragraphs.slice(1);
    const blocks = [];

    photosBeforeParagraph(placements, photos, 0).forEach((placement) => {
        blocks.push(
            <NewspaperPhoto
                key={`before-lead-${placement.photoIndex}`}
                url={placement.url}
                index={placement.photoIndex + 1}
                layout={placement.layout}
            />,
        );
    });

    photosAfterParagraph(placements, photos, 0).forEach((placement) => {
        blocks.push(
            <NewspaperPhoto
                key={`after-lead-${placement.photoIndex}`}
                url={placement.url}
                index={placement.photoIndex + 1}
                layout="full"
                breakout
            />,
        );
    });

    bodyParagraphs.forEach((paragraph, index) => {
        const paragraphIndex = index + 1;

        photosBeforeParagraph(placements, photos, paragraphIndex).forEach((placement) => {
            blocks.push(
                <NewspaperPhoto
                    key={`before-${placement.photoIndex}`}
                    url={placement.url}
                    index={placement.photoIndex + 1}
                    layout={placement.layout}
                />,
            );
        });

        blocks.push(
            <BodyParagraph key={`p-${paragraphIndex}`} content={paragraph} />,
        );

        photosAfterParagraph(placements, photos, paragraphIndex).forEach((placement) => {
            blocks.push(
                <NewspaperPhoto
                    key={`after-${placement.photoIndex}`}
                    url={placement.url}
                    index={placement.photoIndex + 1}
                    layout="full"
                    breakout
                />,
            );
        });
    });

    photosBeforeParagraph(placements, photos, paragraphs.length).forEach((placement) => {
        blocks.push(
            <NewspaperPhoto
                key={`tail-${placement.photoIndex}`}
                url={placement.url}
                index={placement.photoIndex + 1}
                layout={placement.layout}
            />,
        );
    });

    return (
        <>
            <div className="mb-5 border-b-2 border-gray-900 pb-5">
                <LeadParagraph content={lead} />
            </div>

            <div className="clear-both [column-gap:2.5rem] md:columns-2 md:[column-rule:1px_solid_rgb(209_213_219)]">
                {blocks}
            </div>

            <div className="clear-both" aria-hidden="true" />
        </>
    );
}

export default function BeritaKontenRenderer({ konten = '', fotoKegiatan = [] }) {
    const trimmed = konten?.trim() ?? '';
    const photoMap = buildPhotoMap(fotoKegiatan);
    const hasPhotos = Object.keys(photoMap).length > 0;
    const hasPlaceholders = /\[\[foto[1-5]\]\]/i.test(trimmed);

    if (!trimmed && !hasPhotos) {
        return null;
    }

    if (hasPlaceholders) {
        return (
            <article className="mt-6 border-t border-gray-300 pt-5">
                <div className="clear-both [column-gap:2.5rem] md:columns-2 md:[column-rule:1px_solid_rgb(209_213_219)]">
                    {renderWithPlaceholders(trimmed, photoMap)}
                </div>
                <div className="clear-both" aria-hidden="true" />
            </article>
        );
    }

    return (
        <article className="mt-6 border-t border-gray-300 pt-5">
            {renderNewspaperLayout(trimmed, fotoKegiatan)}
        </article>
    );
}
