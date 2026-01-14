
import React from 'react'
import Link from 'next/link'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const prisma = getPrisma()

  const email = process.env.DEMO_CREATOR_EMAIL || 'creator@example.com'
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return React.createElement('div', { className: 'p-10' }, 'Run seed first.')
  }

  return React.createElement(
    'main',
    { className: 'mx-auto max-w-4xl px-4 py-10' },
    [
      React.createElement(
        'h1',
        { key: 'h1', className: 'text-2xl font-extrabold' },
        'Creator dashboard (demo)'
      ),

      React.createElement(
        'p',
        { key: 'p1', className: 'mt-2 text-slate-600' },
        'Connect Stripe and accept the creator fee policy.'
      ),

      React.createElement(
        'div',
        {
          key: 'box',
          className: 'mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
        },
        [
          React.createElement(
            'h2',
            { key: 'h2', className: 'text-lg font-extrabold' },
            'Stripe connection'
          ),

          React.createElement(
            'p',
            { key: 'p2', className: 'mt-2 text-sm text-slate-600' },
            [
              'Connected account: ',
              React.createElement(
                'span',
                { key: 'acct', className: 'font-mono' },
                user.stripeAccountId || 'Not connected'
              ),
            ]
          ),

          React.createElement(
            'div',
            { key: 'btnrow', className: 'mt-4 flex gap-2' },
            React.createElement(
              Link,
              {
                href: `/api/stripe/connect/start?userId=${user.id}`,
                className: 'rounded-full bg-brand-500 px-5 py-2 text-white font-semibold',
              },
              'Connect with Stripe'
            )
          ),

          React.createElement(
            'h3',
            { key: 'h3', className: 'mt-8 text-sm font-extrabold' },
            'Creator fee consent (required)'
          ),

          React.createElement(
            'p',
            { key: 'p3', className: 'mt-2 text-sm text-slate-700' },
            [
              'I agree the platform fee will be deducted from each donation: ',
              React.createElement('b', { key: 'b' }, 'max(1.00, 5% of donation)'),
              ' (no upper cap).',
            ]
          ),

          React.createElement(
            'p',
            { key: 'p4', className: 'mt-2 text-xs text-slate-500' },
            [
              '(MVP) Consent capture UI will be added next. For now, set ',
              React.createElement('code', { key: 'code' }, 'creatorFeeConsentAcceptedAt'),
              ' in DB.',
            ]
          ),
        ]
      ),

      React.createElement(
        'div',
        { key: 'back', className: 'mt-8' },
        React.createElement(
          Link,
          { href: '/', className: 'text-brand-600 font-semibold' },
          '← Back to home'
        )
      ),
    ]
  )
}
