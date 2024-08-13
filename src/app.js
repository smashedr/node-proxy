const express = require('express')
const axios = require('axios')

const port = 3000

const app = express()

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

app.get('/', async (req, res) => {
    try {
        // Parse Reqeust
        console.log('req.query:', req.query)
        const url = req.query.url
        console.log('url:', url)
        if (!url) {
            return res.status(400).send('No "url" in Query String.')
        }

        // Parse Response
        const head = await axios.head(url)
        const contentType = head.headers['content-type']
        console.log('contentType:', contentType)
        if (contentType !== 'application/pdf') {
            return res.status(415).send('Unsupported Media Type')
        }

        const response = await axios.get(url, { responseType: 'stream' })
        response.data.pipe(res)
    } catch (error) {
        console.warn('error:', error)
        res.status(500).send(error.message)
    }
})
