import { PATIENT_FLAGS, FLAG_COLORS } from '../../utils/constants';

export default function FlagBadge({ flag }) {
  const meta = PATIENT_FLAGS.find(f => f.id === flag);
  if (!meta) return null;
  const colors = FLAG_COLORS[meta.color] || FLAG_COLORS.blue;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset
        ${colors.bg} ${colors.text} ${colors.ring}`}
    >
      {meta.label}
    </span>
  );
}
