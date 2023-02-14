import  {postMethodAPI} from "./base.service";


export const  register =async (data:FormData) => {
 const response  = await postMethodAPI('/auth/register',data,true)

  return response
}

export const login =async ({email,password}:{email:string,password:string}) => {
  const response = await postMethodAPI('/auth/login',{email,password})
  return response
}

