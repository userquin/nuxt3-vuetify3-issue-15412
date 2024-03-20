import { promises as fsPromises } from 'node:fs'

disableDevTools()

async function disableDevTools() {
    const filename = 'nuxt.config.ts'
    try {
        const contents = await fsPromises.readFile(filename, 'utf-8')
        await fsPromises.writeFile(filename, contents.replace('devtools: { enabled: true }', 'devtools: { enabled: false }'))
    }
    catch (err) {
        console.error(err)
    }
}
