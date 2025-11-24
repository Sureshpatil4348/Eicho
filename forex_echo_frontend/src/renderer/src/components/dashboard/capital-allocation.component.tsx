import React, { useMemo, useState } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { IoPulseOutline } from 'react-icons/io5'
import { LuWallet } from 'react-icons/lu'


type StrategyCurrencyBreakdown = {
  pair: string
  allocation: number
  utilized: number
  returns: number
}

type StrategyAllocation = {
  id: string
  name: string
  allocation: number
  utilized: number
  returns: number
  currencies: StrategyCurrencyBreakdown[]
}

type AllocationMethod = 'balance' | 'balancePlus' | 'compounding' | 'fixed'

type AllocationDataset = Record<AllocationMethod, {
  description: string
  strategies: StrategyAllocation[]
}>

const allocationData: AllocationDataset = {
  balance: {
    description: 'Distributes capital evenly while respecting current utilization.',
    strategies: [
      {
        id: 'tfp',
        name: 'Trend Following Pro',
        allocation: 80000,
        utilized: 64250,
        returns: 8200,
        currencies: [
          { pair: 'EUR/USD', allocation: 32000, utilized: 25800, returns: 3500 },
          { pair: 'GBP/USD', allocation: 22000, utilized: 17650, returns: 2400 },
          { pair: 'USD/JPY', allocation: 26000, utilized: 20800, returns: 2300 },
        ],
      },
      {
        id: 'arb',
        name: 'Arbitrage Mesh',
        allocation: 60000,
        utilized: 45400,
        returns: 6100,
        currencies: [
          { pair: 'EUR/USD', allocation: 18000, utilized: 13800, returns: 1800 },
          { pair: 'USD/JPY', allocation: 21000, utilized: 15900, returns: 2100 },
          { pair: 'AUD/CAD', allocation: 21000, utilized: 15700, returns: 2200 },
        ],
      },
      {
        id: 'quant',
        name: 'Quant Mean Reversion',
        allocation: 52000,
        utilized: 39800,
        returns: 5400,
        currencies: [
          { pair: 'EUR/USD', allocation: 14000, utilized: 10600, returns: 1600 },
          { pair: 'USD/JPY', allocation: 15000, utilized: 11700, returns: 1500 },
          { pair: 'NZD/USD', allocation: 12000, utilized: 8800, returns: 1200 },
          { pair: 'EUR/GBP', allocation: 11000, utilized: 8700, returns: 1100 },
        ],
      },
      {
        id: 'swing',
        name: 'Swing Grid',
        allocation: 42000,
        utilized: 31800,
        returns: 4100,
        currencies: [
          { pair: 'GBP/USD', allocation: 16000, utilized: 12200, returns: 1500 },
          { pair: 'AUD/CAD', allocation: 13000, utilized: 9600, returns: 1200 },
          { pair: 'EUR/GBP', allocation: 13000, utilized: 10000, returns: 1400 },
        ],
      },
    ],
  },
  balancePlus: {
    description: 'Balances exposure while boosting high-confidence strategies.',
    strategies: [
      {
        id: 'tfp',
        name: 'Trend Following Pro',
        allocation: 90000,
        utilized: 71200,
        returns: 9300,
        currencies: [
          { pair: 'EUR/USD', allocation: 36000, utilized: 28400, returns: 3900 },
          { pair: 'GBP/USD', allocation: 26000, utilized: 20600, returns: 2800 },
          { pair: 'USD/JPY', allocation: 28000, utilized: 22200, returns: 2600 },
        ],
      },
      {
        id: 'arb',
        name: 'Arbitrage Mesh',
        allocation: 52000,
        utilized: 39400,
        returns: 5400,
        currencies: [
          { pair: 'EUR/USD', allocation: 16000, utilized: 12000, returns: 1600 },
          { pair: 'USD/JPY', allocation: 18000, utilized: 13800, returns: 1800 },
          { pair: 'AUD/CAD', allocation: 18000, utilized: 13600, returns: 2000 },
        ],
      },
      {
        id: 'quant',
        name: 'Quant Mean Reversion',
        allocation: 48000,
        utilized: 37200,
        returns: 5000,
        currencies: [
          { pair: 'EUR/USD', allocation: 14000, utilized: 11000, returns: 1600 },
          { pair: 'USD/JPY', allocation: 16000, utilized: 12400, returns: 1700 },
          { pair: 'NZD/USD', allocation: 10000, utilized: 7600, returns: 900 },
          { pair: 'EUR/GBP', allocation: 8000, utilized: 6200, returns: 800 },
        ],
      },
      {
        id: 'swing',
        name: 'Swing Grid',
        allocation: 36000,
        utilized: 28400,
        returns: 3600,
        currencies: [
          { pair: 'GBP/USD', allocation: 14000, utilized: 11000, returns: 1400 },
          { pair: 'AUD/CAD', allocation: 12000, utilized: 9200, returns: 1200 },
          { pair: 'EUR/GBP', allocation: 10000, utilized: 8200, returns: 1000 },
        ],
      },
    ],
  },
  compounding: {
    description: 'Compounds profits and scales allocations according to performance.',
    strategies: [
      {
        id: 'tfp',
        name: 'Trend Following Pro',
        allocation: 102000,
        utilized: 81200,
        returns: 11200,
        currencies: [
          { pair: 'EUR/USD', allocation: 40000, utilized: 31600, returns: 4700 },
          { pair: 'GBP/USD', allocation: 32000, utilized: 25200, returns: 3600 },
          { pair: 'USD/JPY', allocation: 30000, utilized: 24400, returns: 2900 },
        ],
      },
      {
        id: 'arb',
        name: 'Arbitrage Mesh',
        allocation: 58000,
        utilized: 45200,
        returns: 6400,
        currencies: [
          { pair: 'EUR/USD', allocation: 19000, utilized: 15000, returns: 2000 },
          { pair: 'USD/JPY', allocation: 19000, utilized: 15200, returns: 2100 },
          { pair: 'AUD/CAD', allocation: 20000, utilized: 15000, returns: 2300 },
        ],
      },
      {
        id: 'quant',
        name: 'Quant Mean Reversion',
        allocation: 50000,
        utilized: 38800,
        returns: 5600,
        currencies: [
          { pair: 'EUR/USD', allocation: 16000, utilized: 12400, returns: 1900 },
          { pair: 'USD/JPY', allocation: 16000, utilized: 12000, returns: 1800 },
          { pair: 'NZD/USD', allocation: 10000, utilized: 7400, returns: 1000 },
          { pair: 'EUR/GBP', allocation: 8000, utilized: 6000, returns: 900 },
        ],
      },
      {
        id: 'swing',
        name: 'Swing Grid',
        allocation: 36000,
        utilized: 28200,
        returns: 4100,
        currencies: [
          { pair: 'GBP/USD', allocation: 14000, utilized: 11000, returns: 1500 },
          { pair: 'AUD/CAD', allocation: 12000, utilized: 9000, returns: 1400 },
          { pair: 'EUR/GBP', allocation: 10000, utilized: 8200, returns: 1200 },
        ],
      },
    ],
  },
  fixed: {
    description: 'Keeps absolute allocations steady regardless of performance.',
    strategies: [
      {
        id: 'tfp',
        name: 'Trend Following Pro',
        allocation: 75000,
        utilized: 58800,
        returns: 7400,
        currencies: [
          { pair: 'EUR/USD', allocation: 30000, utilized: 23400, returns: 3100 },
          { pair: 'GBP/USD', allocation: 22000, utilized: 17400, returns: 2200 },
          { pair: 'USD/JPY', allocation: 23000, utilized: 18000, returns: 2100 },
        ],
      },
      {
        id: 'arb',
        name: 'Arbitrage Mesh',
        allocation: 48000,
        utilized: 36800,
        returns: 4800,
        currencies: [
          { pair: 'EUR/USD', allocation: 15000, utilized: 11200, returns: 1500 },
          { pair: 'USD/JPY', allocation: 16000, utilized: 12400, returns: 1600 },
          { pair: 'AUD/CAD', allocation: 17000, utilized: 13200, returns: 1700 },
        ],
      },
      {
        id: 'quant',
        name: 'Quant Mean Reversion',
        allocation: 42000,
        utilized: 32200,
        returns: 4200,
        currencies: [
          { pair: 'EUR/USD', allocation: 12000, utilized: 9400, returns: 1400 },
          { pair: 'USD/JPY', allocation: 14000, utilized: 10800, returns: 1400 },
          { pair: 'NZD/USD', allocation: 8000, utilized: 6200, returns: 800 },
          { pair: 'EUR/GBP', allocation: 8000, utilized: 5800, returns: 600 },
        ],
      },
      {
        id: 'swing',
        name: 'Swing Grid',
        allocation: 32000,
        utilized: 24600,
        returns: 3300,
        currencies: [
          { pair: 'GBP/USD', allocation: 12000, utilized: 9400, returns: 1200 },
          { pair: 'AUD/CAD', allocation: 10000, utilized: 7600, returns: 1100 },
          { pair: 'EUR/GBP', allocation: 10000, utilized: 7600, returns: 1000 },
        ],
      },
    ],
  },
}

const formatCurrency = (value: number): string =>
  Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const formatPercent = (value: number): string => `${value.toFixed(1)}%`

const CapitalAllocationComponent: React.FunctionComponent = () => {
  const [selectedMethod, setSelectedMethod] = useState<AllocationMethod>('balance')
  const [liveSyncEnabled, setLiveSyncEnabled] = useState<boolean>(true)

  const selectedAllocation = allocationData[selectedMethod]

  const totalAllocation = useMemo(() => selectedAllocation.strategies.reduce((sum, strategy) => sum + strategy.allocation, 0), [selectedAllocation])
  const totalUtilized = useMemo(() => selectedAllocation.strategies.reduce((sum, strategy) => sum + strategy.utilized, 0), [selectedAllocation])

  const remainingCapital = totalAllocation - totalUtilized
  const utilizationPercent = totalAllocation === 0 ? 0 : (totalUtilized / totalAllocation) * 100

  const currencyBreakdown = useMemo(() => {
    return selectedAllocation.strategies.reduce((acc, strategy) => {
      strategy.currencies.forEach((currency) => {
        const existing = acc[currency.pair] || {
          pair: currency.pair,
          allocation: 0,
          utilized: 0,
          returns: 0,
          strategies: [] as Array<{ name: string; allocation: number }>,
        }

        acc[currency.pair] = {
          ...existing,
          allocation: existing.allocation + currency.allocation,
          utilized: existing.utilized + currency.utilized,
          returns: existing.returns + currency.returns,
          strategies: [...existing.strategies, { name: strategy.name, allocation: currency.allocation }],
        }
      })

      return acc
    }, {} as Record<string, { pair: string; allocation: number; utilized: number; returns: number; strategies: Array<{ name: string; allocation: number }> }>)
  }, [selectedAllocation])

  const strategyColors: Record<string, string> = {
    tfp: '#0F9D58',
    arb: '#4169E1',
    quant: '#6F42C1',
    swing: '#FF8C00',
  }

  return (
    <div className="capital_allocation">
      <div className="title_row">
        <div>
          <p className="eyebrow">Capital Allocation</p>
          <h3>Capital Allocation Control Center</h3>
          <span>Switch methods, monitor utilization, and manage allocations with live recalculations.</span>
        </div>
        <div className="live_controls">
          <button
            className={liveSyncEnabled ? 'live_state active' : 'live_state'}
            onClick={() => setLiveSyncEnabled(!liveSyncEnabled)}
            type="button"
          >
            <HiOutlineLightningBolt />
            {liveSyncEnabled ? 'Live sync enabled' : 'Live sync paused'}
          </button>
          <button className="edit_button" type="button">
            <FiEdit3 />
            Edit Configuration
          </button>
        </div>
      </div>

      <div className="grid two_cols">
        <div className="card">
          <div className="card_head">
            <div>
              <h4>Allocation Method</h4>
              <p>Select the active allocation formula for all strategies.</p>
            </div>
            <span className="badge">Dynamic</span>
          </div>
          <div className="method_selector">
            {[
              { key: 'balance', label: 'Balance' },
              { key: 'balancePlus', label: 'Balance Plus' },
              { key: 'compounding', label: 'Compounding' },
              { key: 'fixed', label: 'Fixed Amount' },
            ].map((option) => (
              <button
                key={option.key}
                className={selectedMethod === option.key ? 'option active' : 'option'}
                onClick={() => setSelectedMethod(option.key as AllocationMethod)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="method_description">
            <IoPulseOutline />
            <p>{selectedAllocation.description}</p>
          </div>
        </div>

        <div className="card summary">
          <div className="card_head">
            <div>
              <h4>Overview Summary</h4>
              <p>Top-level capital metrics for the active method.</p>
            </div>
            <span className="badge neutral">Auto</span>
          </div>
          <div className="metrics_grid">
            <div className="metric">
              <p>Total Capital Allocated</p>
              <h3>{formatCurrency(totalAllocation)}</h3>
            </div>
            <div className="metric">
              <p>Utilized Capital</p>
              <h3 className='green'>{formatCurrency(totalUtilized)}</h3>
              <small>Live utilization updates in real time.</small>
            </div>
            <div className="metric">
              <p>Remaining Capital (Left Out)</p>
              <h3>{formatCurrency(remainingCapital)}</h3>
            </div>
            <div className="metric">
              <p>Percentage Utilized</p>
              <div className="progress">
                <div className="bar" style={{ width: `${utilizationPercent}%` }} />
              </div>
              <h3>{formatPercent(utilizationPercent)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card allocation_snapshot">
        <div className="card_head">
          <div>
            <h4>Allocation Snapshot</h4>
            <p>Current allocation amounts by strategy and method.</p>
          </div>
          <button className="edit_inline" type="button">
            <FiEdit3 />
            Edit Configuration
          </button>
        </div>
        <div className="allocation_list">
          {selectedAllocation.strategies.map((strategy) => {
            const percent = (strategy.allocation / totalAllocation) * 100
            const utilization = (strategy.utilized / strategy.allocation) * 100

            return (
              <div key={strategy.id} className="allocation_row">
                <div className="left">
                  <div className="icon" style={{ background: `${strategyColors[strategy.id]}15`, color: strategyColors[strategy.id] }}>
                    <LuWallet />
                  </div>
                  <div>
                    <h5>{strategy.name}</h5>
                    <p>{formatPercent(percent)} of total capital</p>
                  </div>
                </div>
                <div className="right">
                  <div className="stat">
                    <span>Allocated</span>
                    <strong>{formatCurrency(strategy.allocation)}</strong>
                  </div>
                  <div className="stat">
                    <span>Utilized</span>
                    <strong className='green'>{formatCurrency(strategy.utilized)}</strong>
                    <div className="progress small">
                      <div className="bar" style={{ width: `${utilization}%` }} />
                    </div>
                  </div>
                  <div className="stat">
                    <span>Returns</span>
                    <strong className='green'>{formatCurrency(strategy.returns)}</strong>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid two_cols">
        <div className="card strategy_breakdown">
          <div className="card_head">
            <div>
              <h4>Strategy-Level Allocation</h4>
              <p>Total allocation, utilization, remaining, and currency mix per strategy.</p>
            </div>
            <span className="badge">Live</span>
          </div>
          <div className="strategy_grid">
            {selectedAllocation.strategies.map((strategy) => {
              const left = strategy.allocation - strategy.utilized
              const percentOfTotal = (strategy.allocation / totalAllocation) * 100

              return (
                <div key={strategy.id} className="strategy_card">
                  <div className="top">
                    <div className="title">
                      <div className="dot" style={{ backgroundColor: strategyColors[strategy.id] }} />
                      <h5>{strategy.name}</h5>
                    </div>
                    <span className="chip">{formatPercent(percentOfTotal)} of total</span>
                  </div>
                  <div className="numbers">
                    <div>
                      <p>Allocated</p>
                      <strong>{formatCurrency(strategy.allocation)}</strong>
                    </div>
                    <div>
                      <p>Utilized</p>
                      <strong className='green'>{formatCurrency(strategy.utilized)}</strong>
                    </div>
                    <div>
                      <p>Left / Available</p>
                      <strong>{formatCurrency(left)}</strong>
                    </div>
                    <div>
                      <p>Returns</p>
                      <strong className='green'>{formatCurrency(strategy.returns)}</strong>
                    </div>
                  </div>
                  <div className="currency_breakdown">
                    <div className="header">
                      <p>Currencies traded</p>
                      <span>{strategy.currencies.map((c) => c.pair).join(', ')}</span>
                    </div>
                    <div className="table">
                      <div className="row head">
                        <span>Pair</span>
                        <span>Capital</span>
                        <span>Utilized</span>
                        <span>Remaining</span>
                        <span>% of strategy</span>
                        <span>Returns</span>
                      </div>
                      {strategy.currencies.map((currency) => {
                        const pairPercent = (currency.allocation / strategy.allocation) * 100
                        const remaining = currency.allocation - currency.utilized

                        return (
                          <div key={`${strategy.id}-${currency.pair}`} className="row">
                            <span>{currency.pair}</span>
                            <span>{formatCurrency(currency.allocation)}</span>
                            <span className='green'>{formatCurrency(currency.utilized)}</span>
                            <span>{formatCurrency(remaining)}</span>
                            <span>{formatPercent(pairPercent)}</span>
                            <span className='green'>{formatCurrency(currency.returns)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="stacked_cards">
          <div className="card currency_overview">
            <div className="card_head">
              <div>
                <h4>Currency Pair View</h4>
                <p>Aggregated capital across all strategies with breakdowns.</p>
              </div>
              <span className="badge neutral">Multi-strategy</span>
            </div>
            <div className="table compact">
              <div className="row head">
                <span>Currency Pair</span>
                <span>Total Capital</span>
                <span>Utilization</span>
                <span>Overall %</span>
                <span>Strategies</span>
                <span>Returns</span>
              </div>
              {Object.values(currencyBreakdown).map((currency) => {
                const overallPercent = (currency.allocation / totalAllocation) * 100
                const utilization = (currency.utilized / currency.allocation) * 100

                return (
                  <div key={currency.pair} className="row">
                    <span>{currency.pair}</span>
                    <span>{formatCurrency(currency.allocation)}</span>
                    <span>
                      <div className="progress small">
                        <div className="bar" style={{ width: `${utilization}%` }} />
                      </div>
                      {formatPercent(utilization)} utilized
                    </span>
                    <span>{formatPercent(overallPercent)}</span>
                    <span>
                      <div className="strategies">
                        {currency.strategies.map((strategy) => (
                          <div key={`${currency.pair}-${strategy.name}`} className="pill">
                            {strategy.name} · {formatCurrency(strategy.allocation)}
                          </div>
                        ))}
                      </div>
                      <small>{currency.strategies.length} strategies</small>
                    </span>
                    <span className='green'>{formatCurrency(currency.returns)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card cross_strategy">
            <div className="card_head">
              <div>
                <h4>Cross-Strategy Analysis</h4>
                <p>See how capital concentrates across strategies and pairs.</p>
              </div>
              <span className="badge">Utilization</span>
            </div>
            <div className="analysis_grid">
              <div>
                <h5>Distribution by Strategy</h5>
                <ul>
                  {selectedAllocation.strategies.map((strategy) => {
                    const percent = (strategy.allocation / totalAllocation) * 100
                    return (
                      <li key={`${strategy.id}-distribution`}>
                        <div className="label">
                          <span className="dot" style={{ backgroundColor: strategyColors[strategy.id] }} />
                          <p>{strategy.name}</p>
                        </div>
                        <div className="value">
                          <strong>{formatCurrency(strategy.allocation)}</strong>
                          <span>{formatPercent(percent)}</span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div>
                <h5>Top Currency Pairs</h5>
                <ul>
                  {Object.values(currencyBreakdown)
                    .sort((a, b) => b.allocation - a.allocation)
                    .slice(0, 4)
                    .map((currency) => {
                      const percent = (currency.allocation / totalAllocation) * 100
                      return (
                        <li key={`${currency.pair}-top`}>
                          <div className="label">
                            <span className="dot" />
                            <p>{currency.pair}</p>
                          </div>
                          <div className="value">
                            <strong>{formatCurrency(currency.allocation)}</strong>
                            <span>{formatPercent(percent)}</span>
                          </div>
                        </li>
                      )
                    })}
                </ul>
              </div>
            </div>
            <div className="footer_note">
              Live performance and utilization metrics refresh automatically to keep distribution balanced.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CapitalAllocationComponent
