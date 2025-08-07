const name="ankitmod"
const password="12345678"

exports.LoginAdmin = async (req, res) => {
    
    try{
        const { name, password } = req.body;
        if (name !== "ankitmod" || password !== "12345678") {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({
            message: 'Admin Login successful',
            data: {
                name: name,
                password: password
                }
            });
    }
      catch(error){
        
        res.status(500).json({ message: 'Failed to login admin', error: error.message });

      }
}