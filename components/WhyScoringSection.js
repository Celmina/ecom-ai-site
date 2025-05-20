// components/WhyScoringSection.js
import Image from "next/image";
import { AlertTriangle, Clock, TrendingDown } from "lucide-react";

export default function WhyScoringSection() {
  return (
    <section className="why-scoring-section py-20">
      {/* Section pill header */}
      <div className="pill-section-header">
        <span className="section-label">AI VISIBILITY SCORE</span>
      </div>

      <div className="container max-w-6xl mx-auto px-4">
        <div className="why-scoring-grid">
          {/* Left content */}
          <div className="why-scoring-content">
            <h2 className="why-title">
              Why Your AI Scoring
              <br />
              <span className="highlight-gradient">Makes or Breaks</span> Sales
            </h2>

            <p className="why-intro">
              AI‐powered platforms now prioritize brands with rich, structured
              data. Without a strong AEO score, your products become invisible.
            </p>

            {/* Issues list */}
            <div className="issues-container">
              <div className="issue-card">
                <div className="issue-icon">
                  <AlertTriangle size={22} />
                </div>
                <div className="issue-content">
                  <h3>Invisible to AI Assistants</h3>
                  <p>
                    Your products won't appear in ChatGPT, Bard, or voice search
                    results.
                  </p>
                </div>
              </div>

              <div className="issue-card">
                <div className="issue-icon">
                  <Clock size={22} />
                </div>
                <div className="issue-content">
                  <h3>Slow Discovery & Indexing</h3>
                  <p>
                    New products get buried, taking weeks to be discovered by AI
                    systems.
                  </p>
                </div>
              </div>

              <div className="issue-card">
                <div className="issue-icon">
                  <TrendingDown size={22} />
                </div>
                <div className="issue-content">
                  <h3>Revenue Impact</h3>
                  <p>
                    Lower AI visibility directly correlates to fewer sales and
                    conversions.
                  </p>
                </div>
              </div>
            </div>

            <a href="/get-score" className="score-cta-btn">
              Get Your Score <span className="arrow">→</span>
            </a>
          </div>

          {/* Right image */}
          <div className="why-scoring-visual">
            <div className="phone-container">
              <Image
                src="/Images/AEOScoring.svg"
                alt="AI scoring visualization"
                width={500}
                height={600}
                className="phone-image"
              />

              {/* Score badges */}
              <div className="score-badge low-score">
                <div className="score-value">32/100</div>
                <div className="score-label">
                  Average Score
                  <br />
                  Without AEO
                </div>
              </div>

              <div className="score-badge high-score">
                <div className="score-value">87/100</div>
                <div className="score-label">
                  Average Score
                  <br />
                  With Our Service
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
