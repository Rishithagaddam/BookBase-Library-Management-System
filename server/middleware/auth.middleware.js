const jwt = require('jsonwebtoken');
const Faculty = require('../models/faculty');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Verify token
        req.faculty = await Faculty.findOne({ _id: decoded.id }); // Attach faculty to req
        if (!req.faculty) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const faculty = await Faculty.findById(req.facultyId);
        if (faculty.role !== 'admin') {
            return res.status(403).json({ message: "Require Admin Role!" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};