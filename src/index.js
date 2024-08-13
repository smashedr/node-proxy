const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

app.get('/status', (req, res) => {
    const uptime = Math.floor(process.uptime() / 60)
    res.send(`Uptime: ${uptime} minutes`)
})

app.get('/', async (req, res) => {
    try {
        // Parse Reqeust
        const url = req.query.url
        console.log(`url: ${url}`)
        if (!url) {
            return res.status(400).send('Missing "url" in Query String.')
        }

        // Parse Response
        const head = await axios.head(url)
        const contentType = head.headers['content-type']
        console.log(`contentType: ${contentType}`)
        if (contentType !== 'application/pdf') {
            return res.status(415).send('Unsupported Media Type')
        }

        const response = await axios.get(url, { responseType: 'stream' })
        response.data.pipe(res)
    } catch (error) {
        console.error('error:', error)
        res.status(500).send(error.message)
    }
})
