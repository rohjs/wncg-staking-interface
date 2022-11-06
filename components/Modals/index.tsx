import { Suspense } from 'react'
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
          <Suspense
            key={`modal:suspense:${modal.category}`}
            fallback={
              <div style={{ background: '#fff', color: '#000', fontSize: 20 }}>
                Loading...
              </div>
            }
          >
            <View key={`modal:${modal.category}`} modal={modal} />
          </Suspense>
        ))}
      </AnimatePresence>
    </Portal>
  )
}

export default Modals
