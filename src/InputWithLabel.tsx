import * as React from 'react'
import styles from "./App.module.css"

type InputWithLabelProps = {
  id: string,
  value: string,
  isFocused?: boolean,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  type?: string
  children: React.ReactNode
  }

export const InputWithLabel: React.FC<InputWithLabelProps> = ({
   id,
   value,
   isFocused,
   onInputChange,
   type='text',
   children
  }) => {

  return (
    <div>
      <label htmlFor={id} className={styles.label}>{children}</label>
      &nbsp;
      <input
        type={type}
        id={id}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
        className={styles.input}
      />
    </div>
  )
}