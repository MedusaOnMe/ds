'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Fetch gallery on load
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.images) {
        setGallery(data.images.reverse()); // Newest first
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

      const res = await fetch('/api/transform', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResultImage(data.url);
      // Add to gallery
      setGallery(prev => [data.url, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsTransforming(false);
    }
  };

  const loadingMessages = [
    'Extracting feels...',
    'Applying wojak essence...',
    'Channeling the void...',
    'why even live...',
    'tfw transforming...',
    'Making it cursed...',
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
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* CA Banner */}
        <div className="text-center mb-4">
          <p className="font-bold text-gray-700">CA: coming soon</p>
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-2" style={{ textShadow: '4px 4px 0 #4a90a4' }}>
            WOJAKIFY
          </h1>
          <p className="text-xl text-gray-600">transform any image into a wojak meme</p>
          <p className="text-sm text-gray-500 mt-1">tfw you become a feels guy</p>
          <a
            href="https://x.com/WojakifySol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-gray-700 hover:fill-black"
              aria-label="X (Twitter)"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </header>

        {/* Upload Section */}
        <div className="mb-8">
          <div
            className={`upload-zone p-8 text-center cursor-pointer ${dragOver ? 'dragover' : ''}`}
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
                <div className="text-6xl mb-4">📷</div>
                <p className="text-xl text-gray-700">Drop an image here or click to upload</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, WEBP supported</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Original</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-xs max-h-64 wojak-border"
                  />
                </div>

                {isTransforming && (
                  <div className="text-4xl wobble">➡️</div>
                )}

                {resultImage && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Wojakified</p>
                    <img
                      src={resultImage}
                      alt="Wojak Result"
                      className="max-w-xs max-h-64 wojak-border"
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
                className="wojak-button text-xl"
              >
                {isTransforming ? (
                  <span className="pulse-slow">{loadingMessage}</span>
                ) : (
                  'WOJAKIFY ME'
                )}
              </button>

              {!isTransforming && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setResultImage(null);
                  }}
                  className="ml-4 text-gray-600 underline hover:text-gray-800"
                >
                  clear
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded text-red-700 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Gallery of Feels
          </h2>

          {gallery.length === 0 ? (
            <p className="text-center text-gray-500">No wojaks yet. Be the first!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((url, index) => (
                <div
                  key={index}
                  className="wojak-border bg-white p-2 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setLightboxImage(url)}
                >
                  <img
                    src={url}
                    alt={`Wojak ${index + 1}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>powered by feels</p>
        </footer>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={lightboxImage}
              alt="Wojak fullsize"
              className="max-w-full max-h-[90vh] wojak-border"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute -top-4 -right-4 w-10 h-10 bg-white wojak-border flex items-center justify-center text-2xl hover:bg-gray-100"
              onClick={() => setLightboxImage(null)}
            >
              ✕
            </button>
            <a
              href={lightboxImage}
              download
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 wojak-button text-sm"
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
