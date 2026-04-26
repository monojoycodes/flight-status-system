import { useEffect, useRef, useState } from "react";
import { Plane, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import "./StatsCards.css";

const useCountUp = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return value;
};

const StatsCards = ({ flights = [] }) => {
  const total = flights.length;
  const active = flights.filter((f) => f.status === "boarding" || f.status === "check-in").length;
  const delayed = flights.filter((f) => f.status === "delayed").length;
  const onTimeRate = total > 0 ? Math.round(((total - delayed) / total) * 100) : 0;

  const cTotal = useCountUp(total);
  const cActive = useCountUp(active);
  const cDelayed = useCountUp(delayed);
  const cOnTime = useCountUp(onTimeRate);

  const cards = [
    {
      label: "Total Flights",
      value: cTotal,
      icon: <Plane size={20} />,
      color: "accent",
    },
    {
      label: "Active Now",
      value: cActive,
      icon: <CheckCircle size={20} />,
      color: "success",
    },
    {
      label: "On-Time Rate",
      value: `${cOnTime}%`,
      icon: <Clock size={20} />,
      color: "teal",
    },
    {
      label: "Delayed",
      value: cDelayed,
      icon: <AlertTriangle size={20} />,
      color: "warning",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`stat-card stat-${card.color} animate-scale-in stagger-${i + 1}`}
        >
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-body">
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
