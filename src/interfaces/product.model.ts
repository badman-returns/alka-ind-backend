interface Product{
    id: number,
    categoryId: number,
    name: string,
    code: string,
    description: string,
    productImageId: string,
    productImageURL: string,
    productGLBId: string,
    productGLBURL: string,
    createdBy: number,
    createdOn: Date,
    updatedOn: Date,
}

export {
    Product
}