import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { modalsAtom } from 'states/ui'

import Portal from './Portal'
import View from './View'

function Modals() {
  const modalList = useAtomValue(modalsAtom)

  return (
    <Portal>
      <AnimatePresence>
        {modalList.map((modal) => (
          <View key={`modal:${modal.category}`} modal={modal} />
        ))}
      </AnimatePresence>
    </Portal>
  )
}

export default Modals
