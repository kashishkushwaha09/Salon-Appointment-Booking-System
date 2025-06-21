const {Sequelize}=require('sequelize');
const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    dialect:process.env.DB_DIALECT
});
(
    async()=>{
try {
    await sequelize.authenticate();
    console.log("connection to db has been created");
} catch (error) {
    console.log(error);
}
    }
)();

module.exports=sequelize;