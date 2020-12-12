const bcrypt = require('bcryptjs')

module.exports={
    register:async(req,res)=>{
        const db=req.app.get('db')
        const{isAdmin,username,password} = req.body        
        let [existingUser] = await db.get_user([username])    
        if(existingUser){
            res.status(409).send("username taken")
        }
        const salt=bcrypt.genSaltSync(10)
        const hash=bcrypt.hashSync(password, salt)
        const [user]=await db.register_user([isAdmin,username,hash])
        req.session.user={
            isAdmin:user.is_admin,
            id:user.id,
            username:user.username}
        console.log(req.session.user)
        res.status(201).send(req.session.user)
    },
    login:async(req,res)=>{
        const db=req.app.get('db')
        const {username,password} =req.body
        let [user]=await db.get_user([username])
        if(!user) res.status(401).send("User not found. Please register first")
        const isAuthenticated=bcrypt.compareSync(password,user.hash)
        if(!isAuthenticated) res.status(403).send("Wrong password")
        req.session.user={
            isAdmin:user.is_admin,
            id:user.id,
            username:user.username}
        console.log(req.session.user)
        res.status(200).send(req.session.user)

    },
    logout:async(req,res)=>{
        req.session.destroy()
        res.sendStatus(200)
    }
}