const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 8000;

// Middleware
app.use(cors()); // Use cors middleware to allow cross-origin requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://anyaanivk:EQNNmmfYVDTp5Lmu@knowme.8jjdyn2.mongodb.net/?retryWrites=true&w=majority&appName=KnowME', {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define schema
const companySchema = new mongoose.Schema({
    Cname: String,
    address: String,
    gstNumber: String,
    email: String,
    sharedProfiles: [Number] 
});


// Create model
const Company = mongoose.model('Company', companySchema);


const PersonalSchema = new mongoose.Schema({
    Name: String,
    Phone: Number,
    email: String,
    address: String
});

const Personal = mongoose.model('Personal', PersonalSchema)


// Define schema
const companyLoginSchema = new mongoose.Schema({
    Cname: String,
    email: String,
    password: String
});

// Create model
const CompanyLogin = mongoose.model('CompanyLogin', companyLoginSchema);


const PersonalLoginSchema = new mongoose.Schema({
    PersonalID: {
        type: Number,
        unique: true
    },
    Pname: String,
    email: String,
    password: String,
    phone: String,
    address: String,
});

// Create model
const PersonalLogin = mongoose.model('PersonalLogin', PersonalLoginSchema);

// Route to create a new company profile
// Route to create a new company profile
app.post('/company', (req, res) => {
    const { companyName, companyAddress, companyGSTNumber, email, sharedProfiles } = req.body;

    // Check if the company name already exists in the database
    Company.findOne({ Cname: companyName })
        .then(existingCompany => {
            if (existingCompany) {
                // If company already exists, return an error response
                return res.status(400).json({ error: 'Company name already exists' });
            } else {
                // If company doesn't exist, create a new company instance
                const newCompany = new Company({
                    Cname: companyName,
                    address: companyAddress,
                    gstNumber: companyGSTNumber,
                    email: email,
                    sharedProfiles: sharedProfiles // Assign sharedProfiles array
                });

                // Save the new company to the database
                newCompany.save()
                    .then(company => {
                        console.log('Saved company:', company); // Debug statement
                        res.json({
                            _id: company._id,
                            name: company.Cname,
                            address: company.address,
                            gstNumber: company.gstNumber,
                            cpyemail: company.email,
                            sharedProfiles: company.sharedProfiles
                        });
                    })
                    .catch(err => res.status(400).json({ error: err.message }));
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/personal', (req, res) => {
    const { Name, Address, Phone, email } = req.body;

    // Check if the company name already exists in the database
    Personal.findOne({ email: email })
        .then(existingPersonal => {
            if (existingPersonal) {
                // If company already exists, return an error response
                return res.status(400).json({ error: 'Profile already exists' });
            } else {
                // If company doesn't exist, create a new company instance
                const newPerson = new Personal({
                    Name: Name,
                    address: Address,
                    email: email,
                    Phone: Phone
                });

                // Save the new company to the database
                newPerson.save()
                    .then(person => {
                        console.log('Saved Profile:', person); // Debug statement
                        res.json({
                            _id: person._id,
                            Name: person.Name,
                            address: person.address,
                            email: person.email,
                            Phone: person.Phone
                        });
                    })
                    .catch(err => res.status(400).json({ error: err.message }));
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/personalLogin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Query the database to check if the user account exists
      const existingAccount = await PersonalLogin.findOne({ email, password }).exec();
  
      // Send response to the client
      res.json({ exists: !!existingAccount });
    } catch (error) {
      // Handle errors
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });


app.post('/companyLogin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Query the database to check if the user account exists
      const existingAccount = await CompanyLogin.findOne({ email, password }).exec();
  
      // Send response to the client
      res.json({ exists: !!existingAccount });
    } catch (error) {
      // Handle errors
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  
  // API endpoint to check if email already exists
app.post('/api/checkEmail', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Query the database to check if the email already exists
      const existingEmail = await CompanyLogin.findOne({ email }).exec();
  
      // Send response to the client
      res.json({ exists: !!existingEmail });
    } catch (error) {
      // Handle errors
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
app.post('/api/checkPersonalEmail', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Query the database to check if the email already exists
      const existingEmail = await PersonalLogin.findOne({ email }).exec();
  
      console.log(existingEmail)
      // Send response to the client
      res.json({ exists: !!existingEmail });
    } catch (error) {
      // Handle errors
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  app.post('/api/createAccount', (req, res) => {
    const { name, email, password } = req.body;

    // Check if the username or email already exists in the database
    CompanyLogin.findOne({ email: email })
        .then(existingAccount => {
            if (existingAccount) {
                return res.status(400).json({ error: 'An account with this email already exists' });
            } else {
                // If account doesn't exist, create a new account instance
                const newAccount = new CompanyLogin({
                    Cname: name,
                    email: email,  // Ensure that email is correctly set
                    password: password  // Ensure that password is correctly set
                });

                // Save the new account to the database
                newAccount.save()
                    .then(account => {
                        console.log('Saved account:', account); // Debug statement
                        res.json({
                            _id: account._id,
                            username: account.Cname,
                            email: account.email,
                            password: account.password
                        });
                    })
                    .catch(err => res.status(400).json({ error: err.message }));
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});



async function getCurrentMaxPersonalID() {
    try {
        const maxPersonalID = await PersonalLogin.findOne({}, {}, { sort: { 'PersonalID': -1 } }).select('PersonalID');
        return maxPersonalID ? maxPersonalID.PersonalID : 0;
    } catch (err) {
        console.error('Error getting max PersonalID:', err);
        return 0;
    }
}

app.post('/api/createPersonalAccount', async (req, res) => {
    const { name, email, password, phoneno, address } = req.body;

    try {
        // Get the current maximum PersonalID
        let currentMaxPersonalID = await getCurrentMaxPersonalID();

        // If no PersonalID exists yet, set it to 1
        if (currentMaxPersonalID === 0 || isNaN(currentMaxPersonalID)) {
            currentMaxPersonalID = 1;
        } else {
            // Increment the PersonalID for the new account
            currentMaxPersonalID++;
        }

        // Create a new account instance with the next PersonalID
        const newAccount = new PersonalLogin({
            PersonalID: currentMaxPersonalID,
            Pname: name,
            email: email,
            password: password,
            phone: phoneno,
            address: address
        });

        // Save the new account to the database
        const savedAccount = await newAccount.save();

        res.json({
            PersonalID: savedAccount.PersonalID,
            username: savedAccount.Pname,
            email: savedAccount.email,
            password: savedAccount.password,
            phone: savedAccount.phone,
            address: savedAccount.address
        });
    } catch (err) {
        console.error('Error creating personal account:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get(`/api/company/:email`, async (req, res) => {
    try {
      const userEmail = req.params.email;
  
      // Find the company profile associated with the provided email address
      const companyProfile = await Company.findOne({ email: userEmail });
  
      if (!companyProfile) {
        // If company profile is not found, return a 404 status code and an error message
        return res.status(404).json({ error: 'Company profile not found' });
      }
  
      // If company profile is found, return it as JSON response
      res.json(companyProfile);
    } catch (error) {
      // If an error occurs during the database operation, return a 500 status code and an error message
      console.error('Error fetching company profile data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
app.get(`/api/personal/:email`, async (req, res) => {
    try {
      const userEmail = req.params.email;
      // Find the company profile associated with the provided email address
      const personalProfile = await PersonalLogin.findOne({ email: userEmail });
      console.log(personalProfile);
  
      if (!personalProfile) {
        // If company profile is not found, return a 404 status code and an error message
        return res.status(404).json({ error: 'Personal profile not found' });
      }
  
      // If company profile is found, return it as JSON response
      res.json(personalProfile);
    } catch (error) {
      // If an error occurs during the database operation, return a 500 status code and an error message
      console.error('Error fetching personal profile data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get(`/api/getAllcompanies`, async (req, res) => {
    try {
        // Retrieve all companies
        const allCompanies = await Company.find({});
        console.log(allCompanies)
        // If no companies found, return a 404 status code and an error message
        if (!allCompanies.length) {
            return res.status(404).json({ error: 'No companies found' });
        }

        // If companies found, return them as JSON response
        res.json(allCompanies);
    } catch (error) {
        // If an error occurs during the database operation, return a 500 status code and an error message
        console.error('Error fetching companies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/shareProfile', async (req, res) => {
    const { personalID, companyID } = req.body;

    try {
        // Find the company document by ID and update its sharedProfiles array
        const company = await Company.findByIdAndUpdate(companyID, { $addToSet: { sharedProfiles: personalID } }, { new: true });

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json({ message: 'Profile shared successfully' });
    } catch (err) {
        console.error('Error sharing profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/getSharedProfiles', (req, res) => {
    const { email } = req.query;

    // Check if the company name already exists in the database
    Company.findOne({ email: email })
        .then(company => {
            if (!company) {
                // If company not found, return an error response
                return res.status(404).json({ error: 'Company not found' });
            }

            // Retrieve shared profiles for the company
            const sharedProfiles = company.sharedProfiles;

            // Find details of shared profiles from PersonalLogin schema
            PersonalLogin.find({ PersonalID: { $in: sharedProfiles } })
                .then(sharedProfilesDetails => {
                    res.json(sharedProfilesDetails);
                })
                .catch(err => res.status(500).json({ error: err.message }));
        })
        .catch(err => res.status(500).json({ error: err.message }));
});



// Start the server
app.listen(port, () => console.log(`Server started at port: ${port}`));
