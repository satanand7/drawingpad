import DrawEraseBoard from './DrawEraseBoard'
import StoreProvider from './store/StoreProvider'

function App() {
  return (
    <StoreProvider>
      <DrawEraseBoard />
    </StoreProvider>
  )
  
}

export default App
