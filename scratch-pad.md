table: users

email: VARCHAR(255)
password: VARCHAR(255)

sequelize model:create --name user --attributes email:string,password:string
----
sequelize model:create --name comment --attributes body:text,userId:integer

sequelize model:create --name compose --attributes quote:text,author:string,body:text,userId:integer