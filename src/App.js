import { useEffect, useState } from 'react'
import { Box } from './Box'
import { getJson, postJson } from './net'
import { TodoItem } from './TodoItem'
import { Typography } from './Typography'

function App() {
    const [failure, setFailure] = useState('')
    const [step, setStep] = useState(-1)
    const [status, setStatus] = useState({})

    const urlSearchParams = new URLSearchParams(window.location.search)
    const newApiKey = urlSearchParams.get('v')
    if (newApiKey) {
        localStorage.setItem('apiKey', newApiKey)
        window.location.search = ''
    }

    const port = parseInt(window.location.host.split(':')[1], 10)

    async function wait(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), 500))
    }

    useEffect(() => {
        async function connectToDesktopApi() {
            return getJson(`http://localhost:${port}/status`)
                .then(wait)
                .then(x => setStatus(x))
        }

        async function generateAddress() {
            return postJson(`http://localhost:${port}/setup/address`)
                .then(wait)
                .then(x => setStatus(x))
        }

        async function createInitialTransaction() {
            for (let i = 0; i < 5; i++) {
                try {
                    const response = await postJson(`http://localhost:${port}/setup/transaction`)
                    setStatus(response)
                    setFailure('')
                    return response
                } catch (error) {
                    setFailure(`Faucet call failed, retry #${i + 1}`)
                }
            }
        }

        async function restartBee() {
            return postJson(`http://localhost:${port}/restart`).then(wait)
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
            wait().then(() => window.location.replace(`http://localhost:${port}/dashboard/#/`))
            setStep(5)
        }
    }, [step, port])

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
