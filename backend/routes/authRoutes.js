import express from 'express'
const router=express.Router();
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authorize } from '../middleware/authMiddleware.js';
router.post("/register",async(req,res)=>
{
const{name,email,password,role}=req.body;
try{
    if(!name || !email || !password)
    {
        return res.status(400).json({message:"All fields are  required"})
    }
    const existing=await User.findOne({email})
    if(existing)
    {
        return res.status(400).json({message:"user already existed"})
    }
    const hashedpassword=await bcrypt.hash(password,10);
    const  user=new User(
        {
         name,
         email,
         password:hashedpassword,
         role:role || "member"
        }
      
    )
      await user.save();
     return res.status(201).json({message:"Registered succesfully"})
}
catch(err)
{
    console.log("Registration error",err)
    return res.status(500).json({message:"Internal server error"})
}
})
router.post("/login",async(req,res)=>
{
    const {email,password}=req.body
    try{
        if(!email || !password)
        {
            return res.status(400).json({message:"All filelds are requred"})
        }
        const user=await User.findOne({email})
        if(!user)
        {
            return res.status(404).json({message:"User not found"})
        }
        const comparepassword=await bcrypt.compare(password,user.password)
        if(!comparepassword)
        {
            return res.status(400).json({message:"password is not matching"})
        }
        const token=jwt.sign({
            id:user._id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"})
        return res.status(200).json({message:"Login succesful",
            token,
            user
        }
        )
    }
catch(err)
{
    console.log("error in login",err)
    return res.status(500).json({message:"Internal server error"})

}
})

router.get("/", authorize, async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("_id name");

    return res.status(200).json(users);
  } catch (err) {
    console.log("Fetch users error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
