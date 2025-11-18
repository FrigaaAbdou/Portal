import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  BarChart as RBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts'
import AccountLayout from '../components/layout/AccountLayout'
import {
  fetchAdminFinancialSummary,
  fetchAdminFinanceRevenueTimeseries,
  fetchAdminFinanceSubscriptionsTimeseries,
  fetchAdminFinanceTransactions,
} from '../lib/api'

const EMPTY_SUMMARY = {
  mrr: null,
  activeCount: null,
  pastDueCount: null,
  churn30dCount: null,
}

function DateFilters({ filters, onApply }) {
  const presets = [
    { label: 'Last 7d', days: 7 },
    { label: 'Last 30d', days: 30 },
    { label: 'Last 90d', days: 90 },
  ]

  const applyPreset = (days) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    onApply({ from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) })
  }

  const applyCustom = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const from = form.from.value
    const to = form.to.value
    if (from && to) {
      onApply({ from, to })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => applyPreset(p.days)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          {p.label}
        </button>
      ))}
      <select
        value={filters.plan}
        onChange={(e) => onApply({ ...filters, plan: e.target.value })}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
      >
        <option value="">All plans</option>
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
      </select>
      <select
        value={filters.region}
        onChange={(e) => onApply({ ...filters, region: e.target.value })}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
      >
        <option value="">All regions</option>
        <option value="NA">NA</option>
        <option value="EU">EU</option>
        <option value="Africa">Africa</option>
        <option value="MENA">MENA</option>
      </select>
      <form onSubmit={applyCustom} className="flex items-center gap-2 text-xs text-gray-600">
        <input type="date" name="from" defaultValue={filters.from} className="rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0" />
        <input type="date" name="to" defaultValue={filters.to} className="rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0" />
        <button type="submit" className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600">Apply</button>
      </form>
    </div>
  )
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '$—'
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  } catch {
    return `$${amount}`
  }
}

function computeGroupBy(from, to) {
  try {
    const start = new Date(from)
    const end = new Date(to)
    const spanDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    return spanDays > 90 ? 'month' : 'day'
  } catch {
    return 'day'
  }
}

export default function FinancialDashboard() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY)
  const [invoices, setInvoices] = useState([])
  const [invoiceMeta, setInvoiceMeta] = useState({ hasMore: false, nextCursor: null, prevCursor: null })
  const [invoicePage, setInvoicePage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [error, setError] = useState('')
  const [trend, setTrend] = useState([])
  const [statusBreakdown, setStatusBreakdown] = useState([])
  const [subscriptionsSeries, setSubscriptionsSeries] = useState([])
  const [transactions, setTransactions] = useState([])
  const [txnMeta, setTxnMeta] = useState({ page: 1, total: 0, limit: 25 })
  const [txnLoading, setTxnLoading] = useState(false)

  const [filters, setFilters] = useState(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 30)
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
      plan: '',
      region: '',
      status: '',
    }
  })

  const metrics = useMemo(() => ([
    { title: 'Net Revenue', value: formatCurrency(summary.netRevenue), hint: 'Net of fees/refunds', loading },
    { title: 'MRR', value: formatCurrency(summary.mrr), hint: 'Active + trialing subscriptions', loading },
    { title: 'Active Subscribers', value: summary.activeSubscribers ?? '—', hint: 'Active paying subs', loading },
    { title: 'New Subscriptions', value: summary.newSubscriptions ?? '—', hint: 'Started this period', loading },
  ]), [summary, loading])

  const loadSummary = ({ cursor = {}, invoicesOnly = false, txOnly = false } = {}) => {
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled && !invoicesOnly) setError('Taking longer than usual to load financial data.')
    }, 8000)

    if (invoicesOnly) {
      setInvoiceLoading(true)
    } else if (txOnly) {
      setTxnLoading(true)
    } else {
      setLoading(true)
      setError('')
    }

    const summaryPromise = invoicesOnly || txOnly
      ? Promise.resolve(null)
      : fetchAdminFinancialSummary({
        from: filters.from,
        to: filters.to,
        plan: filters.plan || undefined,
        region: filters.region || undefined,
      });

    const invoicesPromise = txOnly
      ? Promise.resolve(null)
      : fetchAdminFinanceTransactions({
        from: filters.from,
        to: filters.to,
        page: cursor.invoicePage || 1,
        limit: 5,
        status: 'succeeded',
      });

    const groupBy = computeGroupBy(filters.from, filters.to)
    const revenuePromise = invoicesOnly || txOnly
      ? Promise.resolve(null)
      : fetchAdminFinanceRevenueTimeseries({
        from: filters.from,
        to: filters.to,
        groupBy,
        plan: filters.plan || undefined,
        region: filters.region || undefined,
      });

    const subsPromise = invoicesOnly || txOnly
      ? Promise.resolve(null)
      : fetchAdminFinanceSubscriptionsTimeseries({
        from: filters.from,
        to: filters.to,
        groupBy,
        plan: filters.plan || undefined,
        region: filters.region || undefined,
      });

    const txPromise = fetchAdminFinanceTransactions({
      from: filters.from,
      to: filters.to,
      page: cursor.txPage || 1,
      limit: 10,
      status: filters.status || undefined,
      plan: filters.plan || undefined,
      region: filters.region || undefined,
    });

    Promise.all([summaryPromise, invoicesPromise, revenuePromise, subsPromise, txPromise])
      .then((res) => {
        const [summaryRes, invoicesRes, revenueRes, subsRes, txRes] = res
        if (!invoicesOnly && !txOnly) {
          setSummary(summaryRes || EMPTY_SUMMARY)
          setTrend((revenueRes?.points || []).map((p) => ({ label: p.date, value: p.netRevenue || 0 })))
          setStatusBreakdown([
            { name: 'Active', value: summaryRes?.activeSubscribers || 0, fill: '#10b981' },
            { name: 'Past due', value: summaryRes?.pastDueCount || 0, fill: '#f97316' },
          ])
          setSubscriptionsSeries(subsRes?.points || [])
        }
        if (!txOnly && invoicesRes) {
          setInvoices(invoicesRes?.transactions || [])
          const hasMore = (invoicesRes?.transactions || []).length >= (invoicesRes?.limit || 5)
          setInvoiceMeta({ hasMore, nextCursor: null, prevCursor: null })
        }
        if (txRes) {
          setTransactions(txRes.transactions || [])
          setTxnMeta({ page: txRes.page, total: txRes.total || 0, limit: txRes.limit || 10 })
        }
      })
      .catch((err) => {
        if (!invoicesOnly) {
          setError(err?.message || 'Failed to load financial data')
          if (!txOnly) {
            setSummary(EMPTY_SUMMARY)
            setTrend([])
            setStatusBreakdown([])
            setSubscriptionsSeries([])
          }
        }
        setInvoices([])
        setInvoiceMeta({ hasMore: false, nextCursor: null, prevCursor: null })
      })
      .finally(() => {
        if (!cancelled) {
          if (invoicesOnly) {
            setInvoiceLoading(false)
          } else if (txOnly) {
            setTxnLoading(false)
          } else {
            setLoading(false)
          }
        }
        clearTimeout(timer)
      })

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }

  useEffect(() => {
    const cleanup = loadSummary()
    return () => cleanup && cleanup()
  }, [])

  const applyFilters = (range) => {
    const { from, to } = range
    setFilters((prev) => ({ ...prev, from, to }))
    setTxnMeta((prev) => ({ ...prev, page: 1 }))
    setInvoicePage(1)
    loadSummary({ cursor: {}, invoicesOnly: false, txOnly: false })
  }

  const nextInvoices = () => {
    if (!invoiceMeta.hasMore) return
    const nextPage = invoicePage + 1
    setInvoicePage(nextPage)
    loadSummary({ invoicesOnly: true, cursor: { invoicePage: nextPage } })
  }

  const prevInvoices = () => {
    if (invoicePage <= 1) return
    const prevPage = Math.max(1, invoicePage - 1)
    setInvoicePage(prevPage)
    loadSummary({ invoicesOnly: true, cursor: { invoicePage: prevPage } })
  }

  const nextTx = () => {
    const totalPages = Math.ceil((txnMeta.total || 0) / (txnMeta.limit || 10))
    if (txnMeta.page >= totalPages) return
    const nextPage = txnMeta.page + 1
    setTxnMeta((prev) => ({ ...prev, page: nextPage }))
    loadSummary({ txOnly: true, cursor: { txPage: nextPage } })
  }

  const prevTx = () => {
    if (txnMeta.page <= 1) return
    const prevPage = txnMeta.page - 1
    setTxnMeta((prev) => ({ ...prev, page: prevPage }))
    loadSummary({ txOnly: true, cursor: { txPage: prevPage } })
  }

  return (
    <AccountLayout title="Financial Dashboard">
      <div className="rounded-3xl bg-gradient-to-r from-orange-50 via-white to-emerald-50 border border-white/70 shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">Subscription and revenue snapshot.</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <DateFilters filters={filters} onApply={applyFilters} />
          </div>
        </div>
        {error && (
          <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-black/5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.title}</p>
              {loading ? (
                <div className="mt-2 h-6 w-24 animate-pulse rounded bg-gray-100" />
              ) : (
                <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{item.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Revenue trend</h3>
            <span className="text-xs text-gray-500">Last 8 periods</span>
          </div>
          <div className="mt-4 h-[340px] rounded-xl bg-gray-50 px-3 py-3 lg:h-[400px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-lg bg-gray-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Net Revenue" />
                </RLineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Status breakdown</p>
            <p className="text-xs text-gray-600">Active vs past due subscribers.</p>
            <div className="mt-3 h-48">
              {loading ? (
                <div className="h-full animate-pulse rounded-md bg-gray-100" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '12px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Alerts</p>
            <p className="text-xs text-gray-600">Webhook errors, payment failures.</p>
            <div className="mt-2 h-12 rounded-lg bg-gray-50 text-center text-xs text-gray-400 grid place-items-center">
              Coming soon
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Subscriptions over time</h3>
          <span className="text-xs text-gray-500">New vs cancelled</span>
        </div>
        <div className="mt-4 h-[320px] rounded-xl bg-gray-50 px-3 py-3">
          {loading ? (
            <div className="h-full animate-pulse rounded-lg bg-gray-100" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RBarChart data={subscriptionsSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: '12px' }} />
                <Legend />
                <Bar dataKey="newSubscriptions" stackId="a" fill="#10b981" name="New" />
                <Bar dataKey="cancelledSubscriptions" stackId="a" fill="#f97316" name="Cancelled" />
              </RBarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Invoices</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Page {invoicePage}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={prevInvoices}
                disabled={invoicePage <= 1}
                className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={nextInvoices}
                disabled={!invoiceMeta.hasMore}
                className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        { (loading && !invoiceLoading) ? (
          <div className="mt-3 space-y-2">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-12 animate-pulse rounded-md bg-gray-100" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">No invoices to show.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100 text-sm text-gray-800">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Customer</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Due</th>
                  <th className="px-3 py-2 text-left">Paid</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-3 py-2">
                      <div className="font-semibold">{inv.customerEmail || 'Customer'}</div>
                      <div className="text-xs text-gray-500">{inv.id}</div>
                    </td>
                    <td className="px-3 py-2 capitalize text-xs text-gray-700">{inv.status}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency((inv.amountDue || 0) / 100)}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency((inv.amountPaid || 0) / 100)}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{inv.created ? new Date(inv.created).toLocaleDateString() : '—'}</td>
                    <td className="px-3 py-2 text-right text-xs">
                      {inv.hostedInvoiceUrl ? (
                        <a href={inv.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="font-semibold text-orange-600 hover:text-orange-700">View</a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Transactions</h3>
            <p className="text-xs text-gray-600">Payments within the selected range.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
            >
              <option value="">All statuses</option>
              <option value="succeeded">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevTx}
                disabled={txnMeta.page <= 1}
                className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={nextTx}
                disabled={transactions.length < (txnMeta.limit || 10)}
                className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {txnLoading ? (
          <div className="mt-3 space-y-2">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-12 animate-pulse rounded-md bg-gray-100" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">No transactions to show.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100 text-sm text-gray-800">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">User</th>
                  <th className="px-3 py-2 text-left">Plan</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Method</th>
                  <th className="px-3 py-2 text-left">Invoice ID</th>
                  <th className="px-3 py-2 text-left">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-3 py-2 text-xs text-gray-700">{tx.date ? new Date(tx.date).toLocaleString() : '—'}</td>
                    <td className="px-3 py-2">
                      <div className="font-semibold">{tx.userName}</div>
                      <div className="text-xs text-gray-500">{tx.userId}</div>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700">{tx.plan || '—'}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency(tx.amount)} {tx.currency || ''}</td>
                    <td className="px-3 py-2 text-xs capitalize text-gray-700">{tx.status || '—'}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{tx.method || '—'}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{tx.invoiceId || '—'}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{tx.country || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
