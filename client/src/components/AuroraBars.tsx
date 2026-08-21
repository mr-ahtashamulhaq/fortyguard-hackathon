const heightFor = (index: number, total: number) => {
  const arch = Math.sin(index / (total - 1) * Math.PI);
  return 22 + arch * 62;
};

export function AuroraBars() {
  const barCount = 12;
  return <div className="aurora-bars" aria-hidden="true">{Array.from({ length: barCount }, (_, index) => <span key={index} style={{ height: `${heightFor(index, barCount)}%` }} />)}</div>;
}
