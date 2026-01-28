import { ShieldUser, GraduationCap } from "lucide-react";

export default function AdminCard({ title, count, type }) {
  const Icon = type === "instructor" ? GraduationCap : ShieldUser;
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow">
      <Icon className="w-16 h-16 text-green-600" />
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-2xl font-bold text-green-600">{count}</span>
      </div>
    </div>
  );
}
