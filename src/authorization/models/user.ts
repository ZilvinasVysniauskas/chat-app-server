import mongoose from "mongoose";
import { ModelSchemaNames } from "../../common/models.const";

export interface IUser extends mongoose.Document {
    username: string;
    password: string;
    email: string;
}


export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: string;
    token: string;
    expiresIn: number;
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
    },
    chatRooms: [{
        type: Schema.Types.ObjectId,
        ref: ModelSchemaNames.CHAT_ROOM,
    }]
});


const User = mongoose.model(ModelSchemaNames.USER, userSchema);

export default User;