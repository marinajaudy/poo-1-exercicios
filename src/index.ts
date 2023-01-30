import express, { Request, Response} from 'express'
import cors from 'cors'
import {db} from '../src/database/knex'
import {Videos} from '../src/models/videos'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q

        let videosDB 

        if (q) {
            const result = await db("videos").where("title", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result = await db("videos")
            videosDB = result
        }
                    
        const videos = videosDB.map((videoDB)=> new Videos(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.uploadDate
        ))

        res.status(200).send(videos) 

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

