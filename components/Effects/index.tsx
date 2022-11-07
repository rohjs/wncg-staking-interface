import { memo } from 'react'

import BaseEffect from './BaseEffect'
import MediaQueryEffect from './MediaQueryEffect'
import ToastEffect from './ToastEffect'
import TxEffect from './TxEffect'

function Effects() {
  return (
    <>
      <BaseEffect />
      <MediaQueryEffect />
      <ToastEffect />
      <TxEffect />
    </>
  )
}

export default memo(Effects)
