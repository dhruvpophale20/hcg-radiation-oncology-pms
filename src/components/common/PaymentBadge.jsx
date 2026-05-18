import { PAYMENT_COLORS } from '../../utils/constants';

export default function PaymentBadge({ type }) {
  const colors = PAYMENT_COLORS[type] || PAYMENT_COLORS['Cash'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {type}
    </span>
  );
}
