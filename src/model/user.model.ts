import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { GenderEnum, ProviderEnum, RoleEnum } from "src/common/enums"
import { IUser } from "../common/interfaces";
import { BadRequestException } from "@nestjs/common";
import { SecurityModule, SecurityService } from 'src/common/services/security'
import { boolean } from "zod";







export type IHUser = HydratedDocument<User>

@Schema({
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{
        virtuals:true,
        getters:true
    },
    toObject:{
        virtuals:true,
        getters:true
    }
})
export class User implements IUser {

  @Prop({ type: String, required: true })
  firstName!: string;

  @Prop({ type: String, required: true })
  lastName!: string;

  @Virtual({
      set:function(this:IHUser,value:string){
        const [firstName,lastName] = value.split(" ") || []
        this.set({firstName,lastName})
      },
      get:function(this:any){
        return `${this.firstName} ${this.lastName}`
      }
  })
  username?: string | undefined;

  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true})
  password!: string;


  @Prop({ type: String, required: false })
  phone?: string;

  @Prop({type:Number, required:false})
  age?:number


  @Prop({ type: String, required: false })
  profilePicture?: string;

  @Prop({ type: [String], required: false })
  profileCoverPictures?: string[];
  
  @Prop({ type: Date })
  DOB?: Date;

  @Prop({ type: Date }) 
  deletedAt?: Date;

  @Prop({ type: Date })
  restoredAt?: Date;

  @Prop({ type: boolean, default:false })
  confirmEmail!: boolean;

  @Prop({ type: Date })
  changeCredentialsTime?: Date;

  @Prop({ type: Number, enum: GenderEnum, default: GenderEnum.MALE })
  gender!: GenderEnum;

  @Prop({ type: Number, enum: ProviderEnum, default: ProviderEnum.SYSTEM })
  provider!: ProviderEnum;

  @Prop({ type: Number, enum: RoleEnum, default: RoleEnum.USER })
  role!: RoleEnum;

  }

export const UserSchema = SchemaFactory.createForClass(User)


export const userModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    imports:[SecurityModule],
    useFactory: (securityService:SecurityService) => {


    //  UserSchema.pre(['find', 'findOne'], function () {
    //    if (this.getQuery().paranoid == false) {
    //      this.setQuery({
    //        ...this.getQuery(),
    //      });
    //    } else {
    //      this.setQuery({
    //        ...this.getQuery(),
    //        deletedAt: { $exists: false },
    //      });
    //    }
    //  });


    //   UserSchema.pre(['updateOne', 'findOneAndUpdate'], function () {
    //     const update = this.getUpdate() as IHUser;

    //     if (update.deletedAt) {
    //       this.getQuery().paranoId = true;
    //       this.setUpdate({
    //         ...this.getUpdate(),
    //         $unset: { restoredAt: 1 },
    //       });
    //     }

    //     if (update.restoredAt) {
    //       this.setQuery({
    //         ...this.getQuery(),
    //         paranoid: false,
    //         deletedAt: { $exists: true },
    //       });

    //       this.setUpdate({
    //         ...this.getUpdate(),
    //         $unset: { deletedAt: 1 },
    //       });
    //     }

    //     if (this.getQuery().paranoid == false) {
    //       this.setQuery({
    //         ...this.getQuery(),
    //       });
    //     } else {
    //       this.setQuery({
    //         ...this.getQuery(),
    //         deletedAt: { $exists: false },
    //       });
    //     }

    //     console.log(this.getQuery());
    //   });

    //   UserSchema.pre(['deleteOne', 'findOneAndDelete'], function () {
    //     if (this.getQuery().force == true) {
    //       this.setQuery({
    //         ...this.getQuery(),
    //       });
    //     } else {
    //       this.setQuery({
    //         ...this.getQuery(),
    //         deletedAt: { $exists: true },
    //       });
    //     }
    //   });

    //   UserSchema.pre("save",async function (this:IHUser &{wasNew:boolean}){
    //     this.wasNew = this.isNew

    //     if(this.isModified("password")){
    //         this.password = await securityService.hash({plainText:this.password})
    //     }

    //     if(this.phone && this.isModified("phone")){
    //         this.password = await securityService.generateEncryption(this.password)
    //     }

    //   })

    //   UserSchema.pre('validate', function () {
    //     // console.log({ this: this });
    //     if (this.password && this.provider == ProviderEnum.GOOGLE) {
    //       throw new BadRequestException('Google account cannot hold password');
    //     }

    //     // if (!this.slug || this.slug.includes(" ")) {
    //     //     throw new BadRequestException("Invalid slug format")
    //     // }
    //   });

    //   UserSchema.post('validate', function () {
    //     // console.log("validate post ", { this: this });
    //   });

    //   UserSchema.pre('save', function () {
    //     console.log('Hello from pre save');
    //   });
      return UserSchema;
    },
    inject:[SecurityService]
  },
]);
