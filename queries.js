//connects to the postgres spy database from any host
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Spy',
    password: 'password',
    port: 5432
});

//Puts info to database
const sendInfo = async (request, response) => {
    const Data = request.body.Data.toString()
    const Agent = request.body.Agent.toString()
    const Structure = request.body.Structure.toString()
    let results = await pool.query(`INSERT INTO messages (agentnumber, data, structureid) VALUES ($1, $2, $3)`, [Agent, Data, Structure]);
    response.send(`Info: ${Data} Agent:${Agent} Structure:${Structure}`);
};

//Gets info when Selected from certain agent and sends to /spy
//Limit Implemented to only show top three of Stacks or Queues
//Order by also Implemented 
const getInfoAgent = (request, response) => {
    const agentnumber = request.query.Agent;
    const structureid = request.query.Structure;
    const messagekey = request.query.messagekey;
    
    console.log(agentnumber);
    console.log(structureid);

    let asc_or_desc_string = ""
    if(structureid === 'S'){
        asc_or_desc_string = "DESC"; 
    }else{
        asc_or_desc_string = "ASC";
    }

    pool.query(`SELECT * FROM messages WHERE agentnumber = $1 AND structureid = $2
                ORDER BY messagekey ${asc_or_desc_string}
                LIMIT 3`, [agentnumber, structureid], (error, results) => {
        if (error) console.error(error);
        let ret = results.rows[0];
        pool.query('DELETE FROM messages WHERE messagekey = $1', [ret.messagekey], ()=>{
                if (error) throw error;
                response.send(ret.data)
        });
    });
}

const getAgent = (request, response) => {

    pool.query(`SELECT * FROM messages WHERE agentnumber = $1` [agentnumber], (error, results) => {
        //UPDATE with recieved agent
        if (error) throw error;

        response.status(200).json(results.rows);
    });
};

const getStructureS = (request, response) => {

    pool.query(`SELECT * FROM messages WHERE structureid = $1` [structureid], (error, results) => {
        if (error) throw error;

        response.status(200).json(results.rows);
    });
};

const getStructureQ = (request, response) => {

    pool.query(`SELECT * FROM messages WHERE structureid = $1` [structureid], (error, results) => {
        if (error) throw error;

        response.status(200).json(results.rows);
    });
};

module.exports = {
    sendInfo,
    getInfoAgent,
    //deleteInfoAgent,
    getAgent,
    getStructureS,
    getStructureQ
}