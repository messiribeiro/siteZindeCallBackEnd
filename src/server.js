import {fastify} from 'fastify'
import { Server } from 'socket.io'
import crypto from 'crypto'
import BinarySearchTree from './classes/binaryTree.js'
import usersConnecteds from './classes/usersConnecteds.js'


const server = fastify()

const httpServer = server.server;
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

//gerando o id da sessão do usuário
const length = 20;
const randomString = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);

//Instanciando a árvore binária de busca
const binaryTree = new BinarySearchTree();
if(!(binaryTree.search(randomString))){
    // Caso não exista nenhum usuário com esse id, a inserção será realizada
}

var users = {}
const connectedUsers = new usersConnecteds();
var connections = {}

io.on('connection', (socket) => {

    console.log("Cliente conectado")
    
    // gerando o id da sessão do usuário
    const length = 20;
    const randomString = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);

    //verificando se não existe nenhum usuário com esse id na binaryTree
    if(!(binaryTree.search(randomString))){
        // Caso não exista nenhum usuário com esse id, a inserção será realizada
        binaryTree.insert(randomString);
        //enviando o id da sessão para o usuário
        const data = {
            sessionId: randomString
        }
        socket.emit('getSessionId', data)
    }

    socket.on('initSession', (sessionId) => {
        users[sessionId] = socket.id;
        //Enviando o id do receiver
        
        connectedUsers.insert(sessionId);
        console.log("connecteds", connectedUsers.showValues())
        console.log("binatyTree", binaryTree.showValues())
        const receiverId = binaryTree.sortNode([connectedUsers.showValues()])

        if(receiverId == sessionId) {
            socket.emit('receiverId', {
                receiverId: null
            })

        }else {
            socket.emit('receiverId', {
                receiverId
            })

            // console.log(users[getKeyByValue(users, receiverId)])
            io.to(users[receiverId]).emit('newConnection', {
                id: sessionId
            })

            connections[receiverId] = sessionId;



        }


        console.log(connections)
    })


    //função para buscar a key do objeto a partir do valor

    function getKeyByValue(object, value) {
        for (let key in object) {
          if (object[key] === value) {
            return key;
          }
        }
        return null; // Retorna null se o valor não for encontrado
      }

    socket.on('disconnect', () => {
        const SessionId = getKeyByValue(users, socket.id);  
        console.log("session: ", SessionId)
        console.log("Connections: ", connections)
        

        var receiver = connections[SessionId];
        
        if(receiver == undefined) {
            receiver = getKeyByValue(connections, SessionId)
        }

        



        console.log("users: ", users);

        io.to(users[receiver]).emit('receiverDisconnected', {
            message: "receiver has disconnect"
        });


        binaryTree.remove(SessionId);
        connectedUsers.remove(SessionId);
        console.log(connections[SessionId])

        delete connections[SessionId];
    });

    socket.on('sendMessage', (data) => {
        const {receiverId, message} = data;
        
        const sessionId = users[receiverId];

        io.to(sessionId).emit('newMessage', {
            message
        })
    })
})

server.get('/', (request, reply) => {
    reply.send({
        "message": "oi"
    })

})


server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333
})
