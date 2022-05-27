table: users

email: VARCHAR(255)
password: VARCHAR(255)

sequelize model:create --name user --attributes email:string,password:string

sequelize model:create --name comment --attributes body:text,commentsId:integer,

sequelize model:create --name post --attributes postId:integer,title:string,quote:boolean,body:text,