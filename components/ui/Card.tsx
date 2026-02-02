import React from "react";

export function Card({
  children,
  className = "",
  title,
  desc,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  desc?: string;
}) {
  return (
    <div className={"rounded-2xl border border-slate-200 bg-white shadow-sm " + className}>
      {(title || desc) && (
        <div className="border-b border-slate-100 px-5 py-4">
          {title && <div className="text-base font-extrabold text-slate-900">{title}</div>}
          {desc && <div className="mt-1 text-xs text-slate-500">{desc}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={"p-5 " + className}>{children}</div>;
}
