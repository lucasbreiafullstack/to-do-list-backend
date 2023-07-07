import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { TTaskDB } from './types'

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

app.get("/tasks", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined) {
            const result = await db("tasks")
            res.status(200).send(result)
        } else {
            const result = await db("tasks")
                .where("task_name", "LIKE", `%${searchTerm}%`)

            res.status(200).send(result)
        }
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

app.post("/tasks", async (req: Request, res: Response) => {
    try {
        const { task_name } = req.body

        if (typeof task_name !== "string") {
            res.status(400)
            throw new Error("'task_name' deve ser string")
        }

        if (task_name.length < 2) {
            res.status(400)
            throw new Error("'task_name' deve possuir pelo menos 2 caracteres")
        }

        const [ taskIdAlreadyExists ]: TTaskDB[] | undefined[] = await db("tasks")

        if (taskIdAlreadyExists) {
            res.status(400)
            throw new Error("'task' já existe")
        }

        const newTask = {
            task_name 
        }

        await db("tasks").insert(newTask)

        const [ insertedTask ]: TTaskDB[] = await db("tasks")

        res.status(201).send({
            message: "Task criada com sucesso",
            task: insertedTask
        })

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

app.put("/tasks", async (req: Request, res: Response) => {
    try {

        const newtask_name = req.body.task_name

        if (newtask_name !== undefined) {
            if (typeof newtask_name !== "string") {
                res.status(400)
                throw new Error("'task_name' deve ser string")
            }
    
            if (newtask_name.length < 2) {
                res.status(400)
                throw new Error("'task_name' deve possuir pelo menos 2 caracteres")
            }
        }


        const [ task ]: TTaskDB[] | undefined[] = await db("tasks")

        if (!task) {
            res.status(404)
            throw new Error("'task' não encontrada")
        }

        const newTask: TTaskDB = {
            task_name: newtask_name || task.task_name,
    
        }

        await db("tasks").update(newTask)

        res.status(200).send({
            message: "Task editada com sucesso",
            task: newTask
        })

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

app.delete("/tasks", async (req: Request, res: Response) => {
    try {

        const [ taskIdToDelete ]: TTaskDB[] | undefined[] = await db("tasks")

        if (!taskIdToDelete) {
            res.status(404)
            throw new Error("'task' não encontrado")
        }

        await db("tasks").del()

        res.status(200).send({ message: "Task deletada com sucesso" })

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