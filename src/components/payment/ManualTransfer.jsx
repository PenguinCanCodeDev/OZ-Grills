import React from 'react'

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

const ManualTransfer = ({ bankName, accountName, accountNumber, total, onPaid, copyStatus, onCopy }) => {
  return (
    <main className="content payment">
      <div className="paymentHeader">
        <div className="kicker">Secure Payment</div>
        <h1 className="paymentTitle">Manual Bank Transfer</h1>
        <p className="paymentSubtitle">
          Minimize this page, make the transfer in your bank app, then return here.
        </p>
      </div>

      <div className="paymentCard">
        <div className="kv">
          <div className="k">Bank name</div>
          <div className="v">{bankName}</div>
        </div>
        <div className="kv">
          <div className="k">Account name</div>
          <div className="v">{accountName}</div>
        </div>
        <div className="kv accountRow">
          <div>
            <div className="k">Account number</div>
            <div className="v accountNumber">{accountNumber}</div>
          </div>
          <button className="copyBtn" onClick={() => onCopy(accountNumber)}>
            {copyStatus}
          </button>
        </div>
      </div>

      <div className="paymentCard">
        <div className="k">Total to pay</div>
        <div className="bigTotal">{formatNaira(total)}</div>
        <div className="muted">Includes any applicable fees.</div>
      </div>

      <button className="primary cta" onClick={onPaid}>
        I Have Paid
      </button>

      <div className="finePrint">SECURE PAYMENT GATEWAY BY OZ GRILLZ</div>
    </main>
  )
}

export default ManualTransfer
