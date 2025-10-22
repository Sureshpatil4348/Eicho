import React, { useEffect, useState } from 'react'
import { Button, TextField, MenuItem, Tabs, Tab } from '@mui/material'
import axios from '@renderer/config/axios'
import { API_URL } from '@renderer/utils/constant'
import toast from 'react-hot-toast'

const TIMEFRAMES = ['1M', '5M', '15M', '30M', '1H', '4H', '1D']

const ConfigUpdateModal: React.FC<{ closeModal: () => void; strategy_id: string }> = ({
  closeModal,
  strategy_id,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [pairConfigs, setPairConfigs] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  // Fetch existing configs
  const getConfigData = async () => {
    try {
      const res = await axios.get(API_URL.GET_CONFIG_DATA(strategy_id))
      if (res.data.config_data) {
        setPairConfigs(res.data.config_data)
      } else {
        setPairConfigs([])
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message)
    }
  }

  // Add new pair config
  const handleAddPair = () => {
    const newConfig = {
      lot_size: '',
      percentage_threshold: '',
      magic_number: '',
      zscore_threshold_buy: '',
      zscore_threshold_sell: '',
      take_profit_percent: '',
      stop_loss_percent: '',
      max_grid_trades: '',
      grid_spacing_percent: '',
      lookback_period: '',
      ma_period: '',
      max_drawdown_percent: '',
      timeframe: '',
      symbol: '',
      take_profit: '',
      use_take_profit_percent: false,
      use_grid_trading: false,
      use_grid_percent: false,
      zscore_wait_candles: '',
    }
    setPairConfigs((prev) => [...prev, newConfig])
    setActiveIndex(pairConfigs.length)
  }

  // Handle field updates
  const handleFieldChange = (index: number, field: string, value: any, nested = false) => {
    const updated = [...pairConfigs]
    if (nested) {
      updated[index][field] = value
    } else {
      updated[index][field] = value
    }
    setPairConfigs(updated)
  }

  // Submit all pairs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload = pairConfigs
      const res = await axios.post(API_URL.GET_CONFIG_DATA(strategy_id), payload)
      toast.success(res.data.message)
      closeModal()
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getConfigData()
  }, [])

  const currentConfig = pairConfigs[activeIndex]

  return (
    <div className="custom_modal_form">
      <form onSubmit={handleSubmit}>
        {/* Header Tabs for Pair Selection */}
        <div className="pair-tabs">
          <Tabs
            value={activeIndex}
            onChange={(e, val) => setActiveIndex(val)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {pairConfigs.map((pair, i) => (
              <Tab key={i} label={pair?.symbol || `Pair ${i + 1}`} />
            ))}
          </Tabs>
        </div>

        {/* Add new pair button */}
        {/* <div style={{ margin: '1rem 0' }}>
          <Button variant="outlined" onClick={handleAddPair}>
            + Add Pair
          </Button>
        </div> */}

        {/* Active Config Form */}
        {currentConfig && (
          <div className="pair-config">
            {/* <div className="form-group">
              <label>Pair Name</label>
              <TextField
                fullWidth
                value={currentConfig.pair_name}
                onChange={(e) => handleFieldChange(activeIndex, 'pair_name', e.target.value)}
                placeholder="e.g. XAUUSD"
              />
            </div> */}

            {Object.entries(currentConfig).map(([key, value]) => (
              <div key={key} className="form-group" style={{ marginTop: 10 }}>
                {key == 'config_id' ? null :
                  <label style={{ textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </label>}
                {key === 'timeframe' ? (
                  <TextField
                    select
                    fullWidth
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(activeIndex, key, e.target.value, true)
                    }
                  >
                    <MenuItem value="">Select timeframe</MenuItem>
                    {TIMEFRAMES.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : typeof value === 'boolean' ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleFieldChange(activeIndex, key, e.target.checked, true)
                      }
                    />
                    <span style={{ marginLeft: 8 }}>Enable</span>
                  </div>
                ) : key == 'config_id' ? null : (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(activeIndex, key, e.target.value, true)
                    }
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center" style={{ marginTop: 20 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ConfigUpdateModal
