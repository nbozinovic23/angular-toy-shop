import axios from "axios";
import { ToyModel, AgeGroupModel, ToyTypeModel } from "../models/toy.model";

const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    headers: {
        'Accept': 'application/json'
    },
    validateStatus(status) {
        return status === 200
    }
})

export class ToyService {
    static async getToys() {
        return await client.get<ToyModel[]>('/toy')
    }

    static async getToyById(id: number) {
        return await client.get<ToyModel>('/toy/' + id)
    }

    static async getAgeGroups() {
        return await client.get<AgeGroupModel[]>('/age-group')
    }

    static async getToyTypes() {
        return await client.get<ToyTypeModel[]>('/type')
    }

    static async getToysByType(typeName: string) {
        return await client.post<ToyModel[]>('/toy/list', { typeName })
    }
}