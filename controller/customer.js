const db = require('../models');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { setUser, getUsertoken } = require('./auth');
const moment = require('moment');

const SignUp = async (req,res) => {
    try {
        let { firstName, lastName, email, password, phone } = req.body;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const name = `${firstName} ${lastName}`;
        const mailData = `You Have Subscribe to Your Daily News Letter`;
        const mailSubject = "Welcome to Nimap !!!";

        const checkforEmail = await db.customers.findOne({where : { email : email , phone : phone }});
        const checkForNumber = await db.customers.findOne({where : { phone : phone }});

        if(checkforEmail) return res.status(409).json({error : 'E-mail already exists'});
        if(checkForNumber) return res.status(409).json({error : 'Phone Number already exists'});
        if(!checkforEmail && !checkForNumber) {
            const newCustomer = await db.customers.create({firstName, lastName, email, password, phone});
            sendMailToCustomer(name,email,mailData,mailSubject,);
            res.status(201).send(newCustomer);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// firstName,lastName,email,password,phone

const SignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const customer = await db.customers.findOne({ where: { email: email } });
        const chkPassword = await bcrypt.compare(password, customer.password);

        if(!customer) res.status(404).json({error : 'Customer Not Found'});
        if(customer && chkPassword) {
            const custId = customer.dataValues.id; 
            const name = `${customer.dataValues.firstName} ${customer.dataValues.lastName}`
            const custEmail = customer.dataValues.email; 
            const phone = customer.dataValues.phone;
            const subject = `News Update for ${moment().format('LL')}`;
            const sendData = [];

            const token = setUser(custId,name,custEmail,phone,140)

            //sends news to user at 8 AM every day
            cron.schedule("* 8 * * *", async () => { 
                q = 'internation+news';
                await axios.get(`https://newsapi.org/v2/everything?apiKey=${process.env.API_KEY}&q=${q}`)
                .then(response => {
                    for (let i = 0; i < 5; i++) {
                        sendData.push({
                            title : response.data.articles[i].title,
                            description : response.data.articles[i].description
                        });
                    };
                    sendMailToCustomer(name,custEmail,sendData,subject)
                })
                .catch(err => console.log(err))
            });
            res.status(200).json({data : customer , token })
        }
        else res.status(404).json({error : 'Invalid password'})
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const authCustomer = async (req,res,next) => {
    let authToken = req.headers.authorization;
    const token = authToken && authToken.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'Token Expired' });
    req.custData = getUsertoken(token);
    next();
};

const sendMailToCustomer = async (name,email,data,subject) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'elvis67@ethereal.email', // generated ethereal user
          pass: 'QYHwbw8Xf6yqchqtUM', // generated ethereal password
        },
      });

    var str = '';
    var i = 1;
    data.forEach(el => {
    str += 
`<b>${i++}.${el.title}</b>
<p>${el.description}</p><br><br>` 
});

      await transporter.sendMail({
        from: 'elvis67@ethereal.email', // sender address
        to: `${email}`, // list of receivers
        subject: `${subject}`, // Subject line
        html : `<b>Hi ${name},</b>
            <p>You Have Successfully Registered...</p><br>


    
            ${str}

        <b>Thanks & Regards,</b><br>
        <b>elvis67</b>`
      });
}

module.exports = {SignUp, SignIn, authCustomer};