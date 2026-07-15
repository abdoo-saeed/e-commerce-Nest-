import { Injectable } from "@nestjs/common";
import {
  DeleteResult,
  HydratedDocument,
  Model,
  MongooseUpdateQueryOptions,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
} from "mongoose";

type DeleteOneOptions<T> = Parameters<Model<T>["deleteOne"]>[1];


@Injectable()
abstract class DBRepo<TDocument> {
  constructor(private model: Model<TDocument>) {}

  public async findById(
    id: Types.ObjectId | string,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions,
  ): Promise<HydratedDocument<TDocument> | null> {
    const doc = await this.model.findById(id, projection, options);
    return doc;
  }

public async find({
  filter,
  projection,
  options,
}: {
  filter: QueryFilter<TDocument>;
  projection?: ProjectionType<TDocument>;
  options?: QueryOptions;
}): Promise<HydratedDocument<TDocument>[] | []> {

  const docs = await this.model.find(
    filter,
    projection,
    options
  );

  return docs;
}

  public async findOne(
    filter: QueryFilter<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions,
  ): Promise<HydratedDocument<TDocument> | null> {
    const doc = await this.model.findOne(filter, projection, options);
    return doc;
  }

 
public async create(data: Partial<TDocument>): Promise<HydratedDocument<TDocument>> {
    return this.model.create(data) as Promise<HydratedDocument<TDocument>>  // ← cast
}

  public async inserMany({data,}:{data:Partial<TDocument>[]}):Promise<HydratedDocument<TDocument>[]>{
    return this.model.insertMany(data) as Promise<HydratedDocument<TDocument>[]>;
  }


  public async createMany(data:Partial<TDocument>[]):Promise<HydratedDocument<TDocument>[]>{
    return this.model.create(data)
  }



 public async updateOne({
  filter,
  update,
  options,
}: {
  filter: QueryFilter<TDocument>;
  update: UpdateQuery<TDocument>;
  options?: MongooseUpdateQueryOptions<TDocument>;
}): Promise<UpdateWriteOpResult> {
  return this.model.updateOne(filter, update, options);
}

  public async updateMany(
    filter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: MongooseUpdateQueryOptions<TDocument>,
  ): Promise<UpdateWriteOpResult> {
    const result = await this.model.updateMany(filter, update, options);
    return result;
  }

  public async findOneAndUpdate(
    filter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: MongooseUpdateQueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    const docs = await this.model.findOneAndUpdate(filter, update, options);
    return docs;
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId | string,
    update: UpdateQuery<TDocument>,
    options?: MongooseUpdateQueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    const docs = await this.model.findByIdAndUpdate(id, update, options);
    return docs;
  }



public async deleteOne({
  filter,
  options,
}: {
  filter: QueryFilter<TDocument>;
  options?: DeleteOneOptions<TDocument>;
}): Promise<DeleteResult> {
  const result = await this.model.deleteOne(filter, options);

  return result;
}

  public async deleteMany(
    filter: QueryFilter<TDocument>,
    options?: Parameters<typeof this.model.deleteOne>[1],
  ): Promise<DeleteResult> {
    const result = await this.model.deleteMany(filter, options);
    return result;
  }

  public async findOneAndDelete(
    filter: QueryFilter<TDocument>,
    options?: MongooseUpdateQueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    const docs = await this.model.findOneAndDelete(filter,options);
    return docs;
  }

  public async findByIdAndDelete(
    id: Types.ObjectId | string,
    options?: MongooseUpdateQueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    const docs = await this.model.findByIdAndDelete(id, options);
    return docs;
  }
}




export default DBRepo


