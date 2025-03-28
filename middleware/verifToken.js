import jwt from "jsonwebtoken" ;

export const verify = (req, res, next) =>{
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1]; 
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) res.status(403).json("Token is not valid!");
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not authenticated!");
    }
  }

  const isDisabled = (token)=> {
    const arrayToken = token.split(".");
    const tokenPlayload = JSON.parse(atob(arrayToken[1]))
    return tokenPlayload.isDisabled ;
  }

  export const verifyDisabled = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (!isDisabled(token)) {
            next();
        } else {
            return res.status(403).json("You are not authorized to perform this action!");
    
        }
    }
}
  

const isAdmin = (token) => {
const arrayToken = token.split(".");
const tokenPlayload = JSON.parse(atob(arrayToken[1]))
return tokenPlayload.role === "admin" ;
}

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (isAdmin(token)) {
          return next();
      } else {
          return res.status(403).json({ message: "You are not Admin to perform this action!" });
      }
  } else {
      return res.status(401).json({ message: "No token provided!" });
  }
};


