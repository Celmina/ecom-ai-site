// components/GetScoreSection.js
import { useState } from "react";
import { ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";

export default function GetScoreSection() {
  const [formData, setFormData] = useState({
    url: "",
    email: "",
    name: "",
  });

  const [currentStep, setCurrentStep] = useState(1); // Step 1: URL, Step 2: Email & Name
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    // Move to step 2 if URL is valid
    if (formData.url) {
      setCurrentStep(2);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send the data to your backend API
      const response = await fetch("/api/submit-score-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Form submitted successfully
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setCurrentStep(1);
        setFormData({
          url: "",
          email: "",
          name: "",
        });
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const goBack = () => {
    setCurrentStep(1);
  };

  return (
    <section className="get-score-section">
      {/* Flex container for centering */}
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          <div className="score-content text-center max-w-4xl mx-auto">
            <h2 className="score-title">
              What's my Answer Engine Optimization (AEO) score?
            </h2>
            <p className="score-subtitle">
              Find out how visible your store is to AI assistants like ChatGPT
              and how you compare to competitors.
            </p>

            <div className="score-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <CheckCircle size={20} color="#3b82f6" />
                </div>
                <span>Detailed AEO Analysis</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <CheckCircle size={20} color="#3b82f6" />
                </div>
                <span>Competitive Benchmarking</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <CheckCircle size={20} color="#3b82f6" />
                </div>
                <span>Custom Improvement Plan</span>
              </div>
            </div>

            <div className="score-form-container">
              {isSubmitted ? (
                <div className="success-message">
                  <CheckCircle size={60} className="success-icon" />
                  <h3>AEO Assessment Request Received!</h3>
                  <p>
                    We'll analyze your store and send your score within 24
                    hours.
                  </p>
                </div>
              ) : currentStep === 1 ? (
                // Step 1: URL Entry Form
                <form onSubmit={handleUrlSubmit} className="score-form">
                  <div className="step-indicator">
                    <div className="step active">1</div>
                    <div className="step-line"></div>
                    <div className="step">2</div>
                  </div>

                  <div className="step-title">Enter Your Store URL</div>

                  <div className="form-group">
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="Your Store URL (e.g., mystore.com)"
                      required
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="submit-btn">
                    Continue <ArrowRight size={18} className="ml-2" />
                  </button>
                </form>
              ) : (
                // Step 2: Contact Information Form
                <form onSubmit={handleFinalSubmit} className="score-form">
                  <div className="step-indicator">
                    <div className="step completed">1</div>
                    <div className="step-line completed"></div>
                    <div className="step active">2</div>
                  </div>

                  <div className="step-title">Your Contact Information</div>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-nav-buttons">
                    <button type="button" onClick={goBack} className="back-btn">
                      <ArrowLeft size={18} className="mr-2" /> Back
                    </button>

                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        <>
                          Get Free Assessment{" "}
                          <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="privacy-note">
              Your information is secure. We'll never share your data with third
              parties.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
