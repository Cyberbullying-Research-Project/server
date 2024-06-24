import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Resource extends Document{
    @Prop()
    _id: string;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    path: string;

    @Prop()
    type: string;

    @Prop()
    size: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    created_by: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    keywords: string[];
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);