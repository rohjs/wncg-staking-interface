import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { modalsAtom } from 'states/ui'

import Portal from './Portal'

const View = dynamic(() => import('./View'), {
  suspense: true,
})

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
