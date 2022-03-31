export async function getJson(url) {
    return sendRequest(url, 'GET')
}

export async function postJson(url, data) {
    return sendRequest(url, 'POST', data)
}

async function sendRequest(url, method, body) {
    const authorization = localStorage.getItem('apiKey')
    if (!authorization) {
        throw Error('API key not found in local storage')
    }
    const headers = {
        'content-type': 'application/json',
        authorization
    }
    const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    })
    const json = await response.json()
    return json
}
