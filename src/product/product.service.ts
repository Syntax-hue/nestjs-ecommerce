import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/types/product';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { IUser } from 'src/types/user';

@Injectable()
export class ProductService {
    constructor(@InjectModel('Product') private productModel: Model<Product>) { }

    async findAll(): Promise<Product[]> {
        return await this.productModel.find();
    }

    async findOne(id: string): Promise<Product> {
        return await this.productModel.findById(id);
    }

    async create(productDTO: CreateProductDTO, user: IUser): Promise<Product> {
        const product = await this.productModel.create({
            ...productDTO,
            owner: user,
        });
        await product.save();
        return product;
    }

    async update(id: string, productDTO: UpdateProductDTO): Promise<Product> {
        const product = await this.productModel.findByIdAndUpdate(id, productDTO);
        return product;
    }

    async delete(id: string): Promise<Product> {
        return await this.productModel.findByIdAndRemove(id);
    }
    
}
