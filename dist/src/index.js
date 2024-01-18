import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connect } from "mongoose";
import Book from "../models/book.js";
const MONGODB = "mongodb+srv://shresthv1:Shresthv209@trips.wax99th.mongodb.net/?retryWrites=true&w=majority";
const typeDefs = `#graphql
  type Book {
      _id: String
      author: String
      title: String
      year: Int
  }
  input BookInput {
      author: String
      title: String
      year: Int
  }
  type Query {
      getBook(ID: ID!): Book
      getBooks(limit: Int): [Book]
  }
  type Mutation {
      createBook(bookInput: BookInput): String
      updateBook(ID: ID!, bookInput: BookInput): String
      deleteBook(ID: ID!): String
  }
  `;
const resolvers = {
    Query: {
        async getBook(_, { ID }) {
            return Book.findById(ID);
        },
        async getBooks(_, { limit }) {
            return Book.find().limit(limit);
        },
    },
    Mutation: {
        // Corrected the name here
        async createBook(_, { bookInput }) {
            // Corrected the method name
            try {
                const newBook = new Book(bookInput);
                const savedBook = await newBook.save();
                return savedBook._id;
            }
            catch (error) {
                throw new Error(error.message);
            }
        },
        async updateBook(_, { ID, bookInput }) {
            try {
                await Book.updateOne({ _id: ID }, { $set: bookInput });
                return ID;
            }
            catch (error) {
                throw new Error(error.message);
            }
        },
        async deleteBook(_, { ID }) {
            try {
                await Book.deleteOne({ _id: ID });
                return ID;
            }
            catch (error) {
                throw new Error(error.message);
            }
        },
    },
};
async function startApolloServer() {
    try {
        await connect(MONGODB);
        const server = new ApolloServer({ typeDefs, resolvers });
        const { url } = await startStandaloneServer(server, {
            listen: { port: 4000 },
        });
        console.log(`Server is ready at ${url}`);
    }
    catch (error) {
        console.error("Failed to start the server:", error);
    }
}
startApolloServer();
