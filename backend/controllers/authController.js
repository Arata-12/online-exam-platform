// Auth logic
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser} from '../models/User.js';

// register part
export const RegisterUser = async (req, res) => {
    try {
        const {
            email,
            password,
            first_name,
            last_name,
            birth_date,
            gender,
            Institution,
            filiere,
            user_type
        } = req.body;
        // validation fields
        
        if (
        !email || !password || !first_name || !last_name ||
        !birth_date || !gender || !Institution || !filiere || !user_type
        ) {
        return res.status(400).json({ message: 'All fields are required' });
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
        }

        // Password strength (min 6 characters)
        if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Date format check 
        if (isNaN(Date.parse(birth_date))) {
        return res.status(400).json({ message: 'Invalid date of birth' });
        }

        // Valid values for sexe
        const genderLower = gender.toLowerCase();
        if (!['male', 'female'].includes(genderLower)) {
        return res.status(400).json({ message: 'Gender must be "male" or "female"' });
        }

        // Valid user type
        if (!['student', 'teacher'].includes(user_type)) {
        return res.status(400).json({ message: 'User type must be student or teacher' });
        }


        // check email if exist
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({message: 'Email already in use'});
        }

        // hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        // creating user 

        await createUser ({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            birth_date,
            gender,
            Institution,
            filiere,
            user_type
        });
        res.status(201).json({ message: ' User registered successfully' });

    } catch (err) {
        console.error('register Error:' , err);
        res.status(500).json({message: 'server error'});
    }
};

// login part
export const LoginUser = async (req, res) => {
    try {
        const { email, password} = req.body;
        // Check required fields
        if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
        }

        // find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User Not Found!'});

        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
        }
        // create token JWT (the f**cking authentication i hate by arata-12 if maintainece my code make it better!)
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                user_type: user.user_type
            },
            process.env.JWT_SECRET,
            { expiresIn: '3h'}
        );

        res.status(200).json({
            message: 'Login successfull',
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_type: user.user_type  
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'server error'});
    }
};
