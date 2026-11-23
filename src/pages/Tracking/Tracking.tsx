import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import ShipmentCard from '../../components/ShipmentCard/ShipmentCard'
import { useShipmentLookup } from '../../hooks/useShipmentLookup'
import { isValidShipmentId } from '../../services/shipmentService'
import styles from './Tracking.module.css'

const FORMAT_HINT = 'Use "SB" followed by 8 digits, for example SB10000003.'

export default function Tracking() {
  const [value, setValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const { state, search } = useShipmentLookup()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidShipmentId(value)) {
      setValidationError(`That tracking number is not in the right format. ${FORMAT_HINT}`)
      inputRef.current?.focus()
      return
    }
    setValidationError(null)
    void search(value)
  }

  return (
    <section className={styles.page}>
      <h1>Track a shipment</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className={styles.label}>
          Tracking number
        </label>
        <p id={hintId} className={styles.hint}>
          {FORMAT_HINT}
        </p>
        <div className={styles.row}>
          <input
            ref={inputRef}
            id={inputId}
            className={styles.input}
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            aria-invalid={validationError !== null}
            aria-describedby={validationError ? `${hintId} ${errorId}` : hintId}
          />
          <button type="submit" className={styles.button} disabled={state.phase === 'loading'}>
            Track
          </button>
        </div>
        {validationError && (
          <p id={errorId} className={styles.error} role="alert">
            {validationError}
          </p>
        )}
      </form>

      <div aria-live="polite">
        {state.phase === 'loading' && (
          <p className={styles.loading} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            Looking up your shipment…
          </p>
        )}
        {state.phase === 'error' && (
          <p className={styles.error} role="alert">
            {state.error.message}
          </p>
        )}
        {state.phase === 'success' && <ShipmentCard shipment={state.shipment} />}
      </div>
    </section>
  )
}