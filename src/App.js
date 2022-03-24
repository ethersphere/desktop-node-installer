import { useEffect, useState } from 'react'
import { Box } from './Box'
import { TodoItem } from './TodoItem'
import { Typography } from './Typography'

function App() {
    const [failure, setFailure] = useState('')
    const [step, setStep] = useState(-1)
    const [status, setStatus] = useState({})

    async function wait(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), 500))
    }

    useEffect(() => {
        async function connectToDesktopApi() {
            return fetch('http://localhost:5000/status')
                .then(response => response.json())
                .then(wait)
                .then(x => setStatus(x))
        }

        async function generateAddress() {
            return fetch('http://localhost:5000/setup/address', {
                method: 'POST'
            })
                .then()
                .then(response => response.json())
                .then(wait)
                .then(x => setStatus(x))
        }

        async function createInitialTransaction() {
            for (let i = 0; i < 5; i++) {
                try {
                    const response = await fetch('http://localhost:5000/setup/transaction', {
                        method: 'POST'
                    })
                    const x = await response.json()
                    setStatus(x)
                    setFailure('')
                    return x
                } catch (error) {
                    setFailure(`Faucet call failed, retry #${i + 1}`)
                }
            }
        }

        async function restartBee() {
            return fetch('http://localhost:5000/restart', {
                method: 'POST'
            }).then(wait)
        }

        if (step === 0) {
            connectToDesktopApi().then(() => setStep(1))
        }
        if (step === 1) {
            generateAddress().then(() => setStep(2))
        }
        if (step === 2) {
            createInitialTransaction().then(() => setStep(3))
        }
        if (step === 3) {
            restartBee().then(() => setStep(4))
        }
        if (step === 4) {
            wait().then(() => window.location.replace('http://localhost:5000/dashboard/#/'))
            setStep(5)
        }
    }, [step])

    function onClick() {
        setStep(0)
    }

    return (
        <>
            <Box mb={1}>
                <Typography>{failure}</Typography>
            </Box>
            <TodoItem done={step > 0} active={step === 0}>
                Connecting to Bee Desktop API
            </TodoItem>
            <TodoItem done={step > 1} active={step === 1} data={status.address}>
                Generating address
            </TodoItem>
            <TodoItem
                done={step > 2}
                active={step === 2}
                data={step === 2 ? 'This may take up to 20 seconds' : status.config && status.config.transaction}
            >
                Sending initial transaction
            </TodoItem>
            <TodoItem done={step > 3} active={step === 3}>
                Launching Bee
            </TodoItem>
            <button disabled={step !== -1} onClick={onClick}>
                Run Install
            </button>
        </>
    )
}

export default App
