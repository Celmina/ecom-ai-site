// components/VideoSection.js
export default function VideoSection() {
  return (
    <section className="video-section">
      {/* Section label, centered as a pill */}
      {/* Responsive video frame */}
      <div className="video-container">
        <iframe
          className="video-embed"
          src="https://www.youtube.com"
          title="Demo Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}
