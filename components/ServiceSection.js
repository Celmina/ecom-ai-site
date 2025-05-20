import { Cpu, Layers, Monitor, Database } from "lucide-react";

const services = [
  {
    Icon: Cpu,
    title: "AEO Audit",
    desc: "Full audit & schema injection - zero hassle.",
    color: "#7928CA",
  },
  {
    Icon: Layers,
    title: "AI Agent Setup",
    desc: "Branded chat agent built & trained for you.",
    color: "#FF0080",
  },
  {
    Icon: Monitor,
    title: "Monitoring",
    desc: "Monthly AI‐ranking checks & tweaks.",
    color: "#0070F3",
  },
  {
    Icon: Database,
    title: "Schema & Q&A",
    desc: "AI-ranking done for you",
    color: "#00DFD8",
  },
];

export default function ServicesSection() {
  return (
    <section className="services-section">
      {/* Background glow elements */}
      <div className="service-bg-glow"></div>

      {/* Section header */}
      <div className="pill-section-header">
        <span className="section-label">DONE FOR YOU SERVICES</span>
      </div>

      <p className="services-subtitle">
        Make your e-commerce business visible to AI assistants and dominate in
        the new era of search.
      </p>

      {/* Services grid */}
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card-enhanced">
            <div
              className="service-icon"
              style={{ background: `${service.color}20` }}
            >
              <service.Icon size={32} color={service.color} />
            </div>
            <h3 style={{ color: service.color }}>{service.title}</h3>
            <p>{service.desc}</p>
            <div
              className="service-glow"
              style={{ background: service.color }}
            ></div>
          </div>
        ))}
      </div>
    </section>
  );
}
