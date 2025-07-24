import React from 'react'

const CreateStrategyModal: React.FunctionComponent = () => {
  return (
    <div className="custom_modal_form">
      <form>
        <div className="row">
          <div className="col-md-12">
            <h4>Basic Strategy Details</h4>
          </div>
          <div className="col-md-12 form-group">
            <label>Strategy Name</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='E.g. London Breakout' />
            </div>
          </div>
          <div className="col-md-12 form-group">
            <label>Strategy Type</label>
            <div className="field">
              <select className='form-control'>
                <option>Breakout</option>
              </select>
            </div>
          </div>
          <div className="col-md-12 form-group">
            <label>Timeframe</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='M15' />
            </div>
          </div>
          <div className="col-md-12 form-group">
            <label>Preferred Pairs</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='E.g. EUR/USD' />
            </div>
          </div>
          <div className="col-md-12">
            <h4>Technical Criteria</h4>
          </div>
          <div className="col-md-12 form-group">
            <label>Entry Conditions</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='' />
            </div>
          </div>
          <div className="col-md-12 form-group">
            <label>Exit Conditions</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='' />
            </div>
          </div>
          <div className="col-md-12 form-group">
            <label>Indicators Used</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='' />
            </div>
          </div>
          <div className="col-md-12 form-group">
            <label>Risk/Reward Ratio Target</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='E.g. 2.0' />
            </div>
          </div>
          <div className="col-md-12 form-group">
            <label>Max Drawdown Tolerance (%)</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='E.g. 5' />
            </div>
          </div>
          <div className="col-md-12 form-group text-center">
            <button type='button' className='save'>Save Strategy</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateStrategyModal
