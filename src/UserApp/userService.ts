import { Prisma } from '@prisma/client'
import userRepository from "./userRepository"
import * as bcrypt from 'bcrypt';


const ComparePassword = async (hash: string, password: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

async function findUserByEmail(email: string, password: string){
    const user: any = await userRepository.findUserByEmail(email=email)
    if (user instanceof String){
        return user
    } else {
        // if (password == user.password){
        //     const new_user = {
        //         username: user.username,
        //         email: user.email,
        //         role: user.role
        //     }
        //     return new_user
        // }
        const result = await ComparePassword(user.password, password)
        if (result){
            const new_user = {
                username: user.username,
                email: user.email,
                role: user.role
            }
            return new_user
        }
    }
}

async function createUser(data: {username:string, email:string, password:string}){
    const user: any = await userRepository.findUserByEmail(data.email)

    if (user == "Not found"){
        const full_data = {...data, role:"user"}
        const created_user: any = await userRepository.createUser(full_data)
        const data_return = {
            username: created_user.username,
            email: created_user.email,
            role: created_user.role
        }
        
        return data_return

    } else {
        return "User exists"
    }
    
}

const userService = {
    findUserByEmail: findUserByEmail,
    createUser: createUser
}

export default userService