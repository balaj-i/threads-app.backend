import express, { Request, Response } from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'
import { prismaClient } from './lib/db';

async function init() {
    const app = express();

    const gqlserver = new ApolloServer({
        typeDefs: `
        type Query{
            hello:String,
            say(name:String):String
        }
        type Mutation{
         createUser(firstName:String!,lastName:String!,email:String!,password:String!):Boolean
         }`,

        resolvers: {
            Query: {
                hello: () => `hey there,i am graphql server`,
                say: (_, { name }: { name: String }) => `hey ${name},wassup?`
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }:
                    { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            email, password, firstName, lastName,salt:'random_salt',profileImageURL:''
                        },
                    })
                    return true;
                }
            }
        }
    })
    app.use(express.json())
    await gqlserver.start()

    app.get('/', (req: Request, res: Response) => {
        res.json({ message: "threads backend" });
    });
    app.use('/graphql', expressMiddleware(gqlserver))

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

}

init()