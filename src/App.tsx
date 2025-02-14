import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const contractAddress = "0xb3A1d246Af0eDBE5bBE5d4E2f3cfEC058F6C03de"
function App() {
  const [count, setCount] = useState<string>('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^[a-zA-ZăâêôơưđĂÂÊÔƠƯĐ]+$/.test(e.target.value)) {
      setCount(e.target.value)
    }else{
      console.log('khong hop le');
    }
  }
  return (
    <div>
        <input type="text" onChange={handleChange}/>
        {count}
    </div>
  )
}

export default App
