'use client';

import { useState, useEffect, useCallback } from 'react';

type DisneyStyle =
  | 'pixar-3d'
  | 'classic-disney'
  | 'disney-princess';

interface StyleOption {
  id: DisneyStyle;
  name: string;
  description: string;
  emoji: string;
}

const styleOptions: StyleOption[] = [
  { id: 'pixar-3d', name: 'Pixar 3D', description: 'Toy Story, Up, Inside Out', emoji: '🎬' },
  { id: 'classic-disney', name: 'Classic Disney', description: 'Snow White, Cinderella', emoji: '👑' },
  { id: 'disney-princess', name: 'Disney Princess', description: 'Ariel, Belle, Rapunzel', emoji: '👸' },
];

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DisneyStyle>('pixar-3d');

  const getStyleFromUrl = (url: string): string => {
    const filename = url.split('/').pop() || '';
    if (filename.includes('pixar-3d')) return 'Pixar 3D';
    if (filename.includes('classic-disney')) return 'Classic Disney';
    if (filename.includes('disney-princess')) return 'Disney Princess';
    return 'Unknown';
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.images) {
        setGallery(data.images.reverse());
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResultImage(null);
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleTransform = async () => {
    if (!selectedFile) return;

    setIsTransforming(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('style', selectedStyle);

      const res = await fetch('/api/transform', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResultImage(data.url);
      setGallery(prev => [data.url, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsTransforming(false);
    }
  };

  const loadingMessages = [
    'Processing image...',
    'Applying style...',
    'Rendering transformation...',
    'Almost there...',
    'Finalizing...',
    'Just a moment...',
  ];

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (isTransforming) {
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isTransforming]);

  return (
    <main className="min-h-screen py-8 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* CA Banner */}
        <div className="text-center mb-4">
          <p className="font-semibold text-disney-gold/80 tracking-wider text-sm">CA: A62X99RymdBuT2uAH7m8czJVxHsThgPDHi4yJWPpump</p>
        </div>

        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-block relative">
            <img
              src="/disney.png"
              alt="DISNEYIFY"
              className="h-24 md:h-32 mx-auto"
            />
          </div>
          <p className="text-xl text-white/80 mt-4">Transform any image into a Disney character</p>
          <a
            href="https://x.com/i/communities/1999444245732556884"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 p-3 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-white/70 hover:fill-disney-gold transition-colors"
              aria-label="X (Twitter)"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </header>

        {/* Style Selector */}
        <section className="mb-8">
          <h2 className="text-center text-lg font-semibold text-white/90 mb-4">Choose Your Disney Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {styleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`style-card text-center py-6 ${selectedStyle === style.id ? 'selected' : ''}`}
              >
                <div className="text-3xl mb-2">{style.emoji}</div>
                <div className="font-semibold text-white text-lg">{style.name}</div>
                <div className="text-sm text-white/60 mt-1">{style.description}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Upload Section */}
        <div className="mb-10">
          <div
            className={`upload-zone p-10 text-center cursor-pointer ${dragOver ? 'dragover' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            {!preview ? (
              <div>
                <div className="text-6xl mb-4 float">🏰</div>
                <p className="text-xl text-white/90 font-semibold">Drop an image here or click to upload</p>
                <p className="text-sm text-white/50 mt-2">PNG, JPG, WEBP supported</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div>
                  <p className="text-sm text-white/60 mb-2 font-semibold">Original</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-xs max-h-64 disney-border"
                  />
                </div>

                {isTransforming && (
                  <div className="text-4xl wand-wave">➡️</div>
                )}

                {resultImage && (
                  <div>
                    <p className="text-sm text-disney-gold mb-2 font-semibold">Disneyified!</p>
                    <img
                      src={resultImage}
                      alt="Disney Result"
                      className="max-w-xs max-h-64 disney-border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Transform Button */}
          {preview && (
            <div className="text-center mt-6">
              <button
                onClick={handleTransform}
                disabled={isTransforming}
                className="disney-button text-xl px-10"
              >
                {isTransforming ? (
                  <span className="pulse-glow">{loadingMessage}</span>
                ) : (
                  'DISNEYIFY ME'
                )}
              </button>

              {!isTransforming && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setResultImage(null);
                  }}
                  className="ml-4 text-white/60 underline hover:text-white transition-colors"
                >
                  clear
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border-2 border-red-500/50 rounded-xl text-red-300 text-center backdrop-blur-sm">
              {error}
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <section>
          <div className="flex justify-center mb-6">
            <img
              src="/gallery.png"
              alt="Gallery"
              className="h-16 md:h-20"
            />
          </div>

          {gallery.length === 0 ? (
            <p className="text-center text-white/50">No transformations yet. Be the first!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((url, index) => {
                const imageNumber = gallery.length - index;
                return (
                  <div
                    key={index}
                    className="disney-border gallery-card p-2 cursor-pointer"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={url}
                      alt={`Disney ${imageNumber}`}
                      className="w-full h-auto rounded-lg"
                      loading="lazy"
                    />
                    <div className="mt-2 flex justify-between items-center text-xs px-1">
                      <span className="text-white/80 font-semibold">#{imageNumber}</span>
                      <span className="text-disney-gold">{getStyleFromUrl(url)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <div className="absolute -top-12 left-0 right-0 text-center text-white">
              <span className="bg-disney-purple/80 px-4 py-2 rounded-full text-sm font-semibold">
                #{gallery.length - lightboxIndex} • {getStyleFromUrl(gallery[lightboxIndex])}
              </span>
            </div>
            <img
              src={gallery[lightboxIndex]}
              alt="Disney fullsize"
              className="max-w-full max-h-[80vh] disney-border"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute -top-4 -right-4 w-10 h-10 bg-disney-purple disney-border flex items-center justify-center text-xl hover:bg-disney-purple-light transition-colors text-white"
              onClick={() => setLightboxIndex(null)}
            >
              ✕
            </button>
            <a
              href={gallery[lightboxIndex]}
              download
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 disney-button text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              📥 Download
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
