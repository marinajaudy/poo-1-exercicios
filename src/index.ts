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

app.post("/videos", async (req: Request, res: Response) => {
    try {

        const { id, title, duration} = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'duration' deve ser um number")
        }
        const [ videoDBExist ] =  await db("videos").where({id})

        if (videoDBExist) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        //1 - INSTANCIAR os dodos vindos do body
        const newVideo = new Videos(
            id,
            title,
            duration,
            new Date().toISOString()
        )

        //2 - Objeto simples para MODELAR as informações para o banco de dados
        const newVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_date: newVideo.getUploadDate()

        }

        await db("videos").insert(newVideoDB)


        res.status(201).send(newVideo)

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

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {

        const idToEdit = req.params.id
        
        const { id, title, duration} = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'duration' deve ser um number")
        }
        const [ videoDBExist ] =  await db("videos").where({id: idToEdit})

        if (!videoDBExist) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        // //1 - INSTANCIAR os dodos vindos do body
        const newVideo = new Videos(
            id || idToEdit ,
            title || videoDBExist.title,
            duration || videoDBExist.duration,
            new Date().toISOString()
        )

        // //2 - Objeto simples para MODELAR as informações para o banco de dados
        // const newVideoDB = {
        //     id: newVideo.getId(),
        //     title: newVideo.getTitle(),
        //     duration: newVideo.getDuration(),
        //     upload_date: newVideo.getUploadDate()
        // }

        // await db("videos").update(newVideoDB)

        videoDBExist.setId()
        videoDBExist.setTitle(newVideo.title)


        res.status(201).send(newVideo)

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