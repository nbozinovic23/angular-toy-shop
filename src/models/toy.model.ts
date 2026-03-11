export interface AgeGroupModel {
    ageGroupId: number
    name: string
    description: string
}

export interface ToyTypeModel {
    typeId: number
    name: string
    description: string
}

export interface ToyModel {
    toyId: number
    name: string
    permalink: string
    description: string
    targetGroup: 'svi' | 'dečak' | 'devojčica'
    productionDate: string
    price: number
    imageUrl: string
    ageGroup: AgeGroupModel
    type: ToyTypeModel
}