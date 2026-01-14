export function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amountMinor / 100)
}

export const MIN_DONATION_MINOR = 500

export function platformFeeMinor(donationMinor: number) {
  const fivePercent = Math.round(donationMinor * 0.05)
  return Math.max(100, fivePercent)
}
