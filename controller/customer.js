const db = require('../models');
let customer=db.customers
const bcrypt = require('bcryptjs');
// const ?
// const { setUser, getUsertoken,secretKey } = require('../service/auth');

const SignUp = async (req,res) => {
    try {
        let { firstName, lastName, email, password, phone } = req.body;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        console.log( 
        `firstName: ${firstName},
        lastName : ${lastName},
        email :${email},
        password : ${password},
        phone : ${phone}
        db.customers : ${customer}`);

        const newUser = await db.customers.create({firstName, lastName, email, password, phone});
        res.status(201).send(newUser);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// firstName,lastName,email,password,phone

const SignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const customer = await db.customers.findOne({ where: { email: email } });
        const chkPassword = await bcrypt.compare(password, customer.password);
        if(chkPassword) res.status(200).json(customer);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {SignUp, SignIn};